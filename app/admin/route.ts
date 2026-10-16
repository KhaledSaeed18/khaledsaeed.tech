/**
 * There is no admin. A route handler, not a page, so none of the site's
 * layout, fonts or styles come with it: a black sheet and one line of
 * binary in the browser's own type.
 */
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>admin</title>
</head>
<body style="background:#000;color:#fff;margin:0">01110011 01101001 01111000 00100000 01110011 01100101 01110110 01100101 01101110</body>
</html>
`

export const dynamic = "force-static"

export function GET() {
  return new Response(PAGE, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  })
}
