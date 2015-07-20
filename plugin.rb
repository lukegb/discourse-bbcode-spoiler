# name: discourse-bbcode-spoiler
# about: A Discourse plugin to support block-style spoiler tags.
# version: 0.1
# authors: Luke Granger-Brown

PLUGIN_NAME ||= "discourse_bbcode_spoiler".freeze

register_asset "javascripts/bbcode_spoiler_dialect.js", :server_side
register_asset "stylesheets/spoilerrific.css"

after_initialize do

  Email::Styles.register_plugin_style do |fragment|
  	# We don't want to show the spoiler in emails, nor do we want to include their content
  	# so we strip out everything except the "button"
    fragment.css('.spoilerrific').each do |i|
      label = i.elements.css("label").first
      new_node = i.replace "<div style=\"display: block;padding: 10px;background-color: gray;color: white;margin-bottom: 10px;\">Spoiler: <span style=\"font-weight: bold;\"></span> (view post to open!)</div>"
      label_span = new_node.css("span").first
      label_span.prepend_child label.children
    end
  end

end
