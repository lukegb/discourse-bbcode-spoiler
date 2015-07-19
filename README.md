discourse-bbcode-spoiler
========================

A Discourse Plugin to support "conventional" block-style spoiler tags.

Usage
=====

In your posts, surround text with `[spoiler]` and `[/spoiler]`. If you want to specify text for the button that isn't "Click for FLARD", then you can do so by using `[spoiler=Less FLARD]`.

Installation
============

* Add the plugin's repo url to your container's yml config file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/lukegb/discourse-bbcode-spoiler.git
```

* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

License
=======

MIT
