// sanity/queries/shared/link.ts
export const linkQuery = `
    _key,
    ...,
    "href": select(
      isExternal => href,
      defined(anchor) && !defined(internalLink) => "#" + anchor,
      defined(href) && !defined(internalLink) => href,
      defined(anchor) && @.internalLink->slug.current == "index" => "/#" + anchor,
      defined(anchor) && @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current + "#" + anchor,
      defined(anchor) && defined(@.internalLink->slug.current) => "/" + @.internalLink->slug.current + "#" + anchor,
      @.internalLink->slug.current == "index" => "/",
      @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
      "/" + @.internalLink->slug.current
    )
`;
