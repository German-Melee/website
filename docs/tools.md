# werkzeuge für link previews, z.B. für discord

- https://metatags.io/ - geht nur für online websites, also nicht in development

- https://chromewebstore.google.com/detail/social-share-preview/ggnikicjfklimmffbkhknndafpdlabib - sollte lokal funktionieren, aber hab noch nicht getestet

# wenn github scheduled workflows (cron) deaktiviert

> GitHub will suspend the scheduled trigger for GitHub action workflows if there is no commit in the repository for the past 60 days. The cron based triggers won't run unless a new commit is made. It shows the message "This scheduled workflow is disabled because there hasn't been activity in this repository for at least 60 days" under the cronjob triggered action.

- vielleicht sowas hier einrichten https://github.com/marketplace/actions/keepalive-workflow
