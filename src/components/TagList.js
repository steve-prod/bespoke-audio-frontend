export default function TagList(props) {
  const tags = props.tags.map(function(tag) {
      return tag = '#' + tag;
  }).join(' ');
  return tags;
}
