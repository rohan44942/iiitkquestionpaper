import React, { useContext, useState } from "react";
import { FaDownload, FaEye, FaTrash, FaFilePdf, FaHeart, FaRegHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { UserContext } from "../contextapi/userContext";

const QPaper = ({ data }) => {
  const { file, apiUrl, user, admin1, admin2, observer, handleDelete } = data;
  const { isFavorite, toggleFavorite, isAuthenticated } = useContext(UserContext);
  const [busy, setBusy] = useState(false);

  const title = file.metadata?.fileName || file.filename;
  const favorited = isFavorite(file._id, "paper");
  const isPdf = file.filename?.toLowerCase().endsWith(".pdf");

  const onFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    await toggleFavorite({
      resourceId: file._id,
      resourceType: "paper",
      title,
      meta: `${file.metadata?.year || ""} · ${file.metadata?.branch || ""}`,
    });
    setBusy(false);
  };

  return (
    <article
      ref={observer}
      className="surface-card p-4 flex flex-col animate-fadeUp"
    >
      <div className="relative overflow-hidden rounded-xl bg-paper border border-paper-line h-40 flex items-center justify-center">
        {isPdf ? (
          <div className="flex flex-col items-center gap-2 text-accent">
            <FaFilePdf className="text-5xl opacity-80" />
            <span className="text-xs text-ink-muted uppercase tracking-wide">PDF paper</span>
          </div>
        ) : (
          <LazyLoadImage
            alt={title}
            effect="blur"
            className="w-full h-40 object-cover"
            src={`${apiUrl}/api/uploads/${file.filename}`}
          />
        )}
        <button
          type="button"
          disabled={busy}
          onClick={onFavorite}
          aria-label={favorited ? "Remove favorite" : "Save favorite"}
          className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/95 border border-paper-line flex items-center justify-center text-accent hover:scale-105 transition"
        >
          {favorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="mt-4 flex-grow space-y-1.5">
        <h3 className="font-display text-lg text-ink leading-snug line-clamp-2">
          <a
            href={`${apiUrl}/api/uploads/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            {title}
          </a>
        </h3>
        <p className="text-sm text-ink-muted line-clamp-2">
          {file.metadata?.description || "No description"}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {file.metadata?.year && <span className="chip">{file.metadata.year}</span>}
          {file.metadata?.branch && (
            <span className="chip !bg-paper !text-ink-muted">{file.metadata.branch}</span>
          )}
        </div>
        <p className="text-xs text-ink-muted pt-1">
          {file.metadata?.uploadedBy || "Helper"} ·{" "}
          {file.uploadDate
            ? new Date(file.uploadDate).toLocaleDateString("en-IN")
            : "—"}
          {file.length ? ` · ${(file.length / 1024).toFixed(0)} KB` : ""}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`${apiUrl}/api/download/${file.filename}`}
          className="btn-primary !py-2 !px-3 text-xs"
        >
          <FaDownload /> Download
        </a>
        <a
          href={`${apiUrl}/api/uploads/${file.filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost !py-2 !px-3 text-xs"
        >
          <FaEye /> View
        </a>
        {(user?.role === "admin" ||
          user?.email === admin1 ||
          user?.email === admin2) && (
          <button
            type="button"
            onClick={() => handleDelete(file._id, "exam")}
            className="btn-ghost !py-2 !px-3 text-xs !text-red-600 !border-red-200"
          >
            <FaTrash /> Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default QPaper;
