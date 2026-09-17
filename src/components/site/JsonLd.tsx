/**
 * One <script type="application/ld+json"> block.
 *
 * Exists mainly for the escaping. `JSON.stringify` does not escape `<`, so a
 * string containing `</script>` anywhere in the graph would close the tag
 * early and put the remainder of the JSON into the document as markup. All of
 * our structured data is built from copy authored in this repo, so this is
 * defence in depth rather than a live hole — but it costs one replace, and the
 * alternative is that the day someone pastes a snippet of HTML into an article
 * dek, the failure is an XSS rather than a lint error.
 *
 * `<` is escaped as `<`, which is valid JSON and parses back to the same
 * string, so consumers see exactly the intended value.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/** JSON, safe to embed between <script> tags. */
export function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
