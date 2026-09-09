// Robust client-side printing.
//
// Two bugs used to make "Print" appear broken:
//   1. The player modal opened a print window, then called print()/close()
//      synchronously right after document.write — racing the render and the
//      (base64) logo image load, so the dialog opened on a blank page and the
//      window was closed before the job could run.
//   2. The receipt modals called window.print() on the live page, which printed
//      the entire app sitting behind the dialog (only .no-print was hidden).
//
// This helper fixes both: it renders the chosen content in a dedicated window,
// copies the app's stylesheets so Tailwind classes still apply, waits for the
// document (and its images) to finish loading, then prints and closes.

export interface PrintOptions {
  /** Document title — used as the default filename in the print dialog. */
  title?: string;
  /** Extra CSS injected into the print document, after the copied app styles. */
  styles?: string;
  /** Copy the app's <style>/<link> tags so Tailwind classes render. Default true. */
  copyAppStyles?: boolean;
  /** HTML inserted before the content (e.g. a print-only letterhead). */
  headerHtml?: string;
}

function collectAppStyles(): string {
  return Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join("\n");
}

/** Render arbitrary HTML in a print window and trigger the print dialog. */
export function printHtml(bodyHtml: string, options: PrintOptions = {}): boolean {
  const {
    title = document.title,
    styles = "",
    copyAppStyles = true,
    headerHtml = "",
  } = options;

  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    // Almost always a pop-up blocker.
    alert("Please allow pop-ups for this site so the document can be printed.");
    return false;
  }

  const appStyles = copyAppStyles ? collectAppStyles() : "";

  printWindow.document.open();
  printWindow.document.write(
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    ${appStyles}
    <style>
      body { margin: 0; padding: 24px; background: #fff; }
      @media print { body { padding: 0; } .no-print { display: none !important; } }
      ${styles}
    </style>
  </head>
  <body>${headerHtml}${bodyHtml}</body>
</html>`
  );
  printWindow.document.close();
  printWindow.focus();

  let printed = false;
  const doPrint = () => {
    if (printed || printWindow.closed) return;
    printed = true;
    printWindow.print();
    // Close after the dialog has had the document; harmless if already closed.
    setTimeout(() => {
      if (!printWindow.closed) printWindow.close();
    }, 500);
  };

  // Prefer the load event (waits for images + copied stylesheets). Fall back to
  // a timeout in case load already fired while we were writing the document.
  printWindow.onload = doPrint;
  setTimeout(doPrint, 1200);

  return true;
}

/** Print a single element (by id) from the current page, with app styling intact. */
export function printElementById(elementId: string, options: PrintOptions = {}): boolean {
  const el = document.getElementById(elementId);
  if (!el) {
    alert("There is nothing to print yet. Please wait for the content to load and try again.");
    return false;
  }
  return printHtml(el.outerHTML, options);
}
