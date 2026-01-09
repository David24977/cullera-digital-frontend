function MediaNoticia({ mediaUrl, titulo, className = "" }) {
  if (!mediaUrl) return null;

  const esVideo =
    mediaUrl.includes("youtube.com") ||
    mediaUrl.includes("youtu.be");

  // 🎥 VIDEO
  if (esVideo) {
    let embedUrl = mediaUrl;

    if (mediaUrl.includes("youtu.be")) {
      const id = mediaUrl.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }

    if (mediaUrl.includes("watch?v=")) {
      const id = mediaUrl.split("watch?v=")[1].split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }

    return (
      <div className={`relative w-full ${className}`}>
        <iframe
          src={embedUrl}
          title={titulo}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 🖼️ IMAGEN
  return (
    <img
      src={mediaUrl}
      alt={titulo}
      className={className}
    />
  );
}

export default MediaNoticia;
