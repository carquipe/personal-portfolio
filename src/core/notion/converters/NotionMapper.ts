export function mapNotionPage(page: any) {
  const props = page.properties;
  return {
    id: page.id,
    title: props?.Name?.title?.[0]?.plain_text ?? "",
    slug: props?.Slug?.rich_text?.[0]?.plain_text ?? "",
    published: props?.Published?.checkbox ?? false,
    date: props?.Date?.date?.start ?? "",
  };
}