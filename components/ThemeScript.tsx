const script = `
  (function () {
    try {
      var storedTheme = window.localStorage.getItem("display-pro-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = storedTheme || (prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

