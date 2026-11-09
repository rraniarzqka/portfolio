# Rania Rizqika — Portfolio

Live website: https://rraniazqka.netlify.app/

The approved portfolio is a buildless static site in `public/`. Netlify reads
`netlify.toml`, publishes only `public/`, and redeploys when `main` changes.

## Editing

Use the approved `Website/` source folder from the owner’s local project.
Copy approved updates into `public/` for the next release. Keep local project
notes, backups, and raw source reports outside `public/`.

Preview with `python3 -m http.server 4187 --directory public`.
Update CSS/JS version query strings when changing those files.

## Navigation and retained files

The homepage links to PRENAGEN, Ascott, Taman Safari, Havara Studio and Boleh Belajar.
The three brand overviews link to their detailed work samples. Inner pages have
breadcrumbs. `_redirects` retains the old `/work/*.html` links.
Certification and CV PDFs remain at their existing `/assets/` URLs.
The existing noindex,nofollow policy is retained.

## Previous version

The previous site is preserved in Git commit
`1da6bef5a0cad9ca8fba6f09bcba31f7289ea5fd` and in the local release backup.
The older root HTML/assets are legacy source and are not published by Netlify.
