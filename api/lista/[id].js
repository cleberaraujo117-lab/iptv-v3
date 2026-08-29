// ATUALIZADO VIA APP - lista principal
const CANAIS_ATUAIS = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  let rawId = "";
  try {
    if(req.query && req.query.id) rawId = req.query.id.toString();
    else if(req.url){
      const mm = req.url.match(/\/api\/lista\/(.+)/);
      if(mm) rawId = decodeURIComponent(mm[1]);
    }
  } catch(e){}
  rawId = rawId.replace(/\.m3u$/i,"").split("?")[0];
  const timeMatch = rawId.match(/(\d{13})$/);
  let expirado = false;
  if(timeMatch){
    const criadoEm = parseInt(timeMatch[1],10);
    let dur = 6*60*60*1000;
    if(rawId.includes("-M30-")) dur=30*24*60*60*1000;
    else if(rawId.includes("-T90-")) dur=90*24*60*60*1000;
    else if(rawId.includes("-A365-")) dur=365*24*60*60*1000;
    if(Date.now()-criadoEm>dur) expirado=true;
  }
  if(expirado){
    res.setHeader("Content-Type","audio/x-mpegurl");
    return res.status(200).send('#EXTM3U\n#EXTINF:-1 group-title="AVISO",CONTA EXPIRADA - RENOVE\nhttps://via.placeholder.com/1x1.mp4');
  }
  let m3u='#EXTM3U\n';
  CANAIS_ATUAIS.forEach(c=>{
    m3u+=`#EXTINF:-1 group-title="${c.grupo}",${c.nome}\n${c.url}\n`;
  });
  res.setHeader("Content-Type","audio/x-mpegurl; charset=utf-8");
  res.setHeader("Content-Disposition",`inline; filename="${rawId||'lista'}.m3u"`);
  return res.status(200).send(m3u);
      }
    
