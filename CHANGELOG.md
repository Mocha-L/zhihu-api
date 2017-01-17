# 2.4.0 / 2017-01-17

- Fix questions to meet the zhihu new API.

# 2.3.2 / 2016-12-26

- Fix all incorrect comments count bug.

# 2.3.1 / 2016-12-25

- Fix bug: incorrect comments count for topic answers.

# 2.3.0 / 2016-12-19

- Improve request module.
- Add `api.column`.

# 2.2.0 / 2016-12-14

- Add `api.action`: follow/unfollow users, send messages, vote answers.

# 2.1.1 / 2016-12-14

- `mkdir -p` if directory not exists when downloading images.
- Improve request module.

# 2.1.0 / 2016-12-13

- Add collection API.
- Add `Image.from` method.

# 2.0.0 / 2016-12-12

- Changed user API to support new homepage.
- Support multiple sessions.
- Request with authorization headers.
- Unify property names with official version.
- Image downloader.

# 1.0.1 / 2016-11-16

- Add Travis-CI.

# 1.0.0 / 2016-11-15

- Add `api.org`.
- For user and organization, change property `uname` to `slug`.
- Add `type` property to user and organization.
- Remove `config.js`.
- Update `request.js`.
- Remove `api.action`.
- Improve parser.
- Other enhancements.

# 0.7.1 / 2016-06-29

- Add detail information for collection activities and roundtable activities

# 0.7.0 / 2016-06-10

- Add detail infromation for `user.activities()`
- Update docs

# 0.6.0 / 2016-06-03

- Code style: use 2-space indent
- Fix bug: anonymous users' link should be empty string
- Improve comments
- Refactor `config`

# 0.5.1 / 2016-05-19

- Remove `user.status()`
- Add user status to `user.detail()`

# 0.5.0 / 2016-05-18

- Add `answer.comments()`
- Add `Answer.exploreDay()` and `Answer.exploreMonth()`
- Update docs

# 0.4.1 / 2016-05-13

- Remove `user.latestActivity()`
- Add `user.activities()`
- Update docs

# 0.4.0 / 2016-05-09

- Add docs
- Add `api.answer`
- Change license from WTFPL to MIT
- Other enhancement

# 0.3.0 / 2016-05-03

- Fix parser due to zhihu's page adjustment
- Fix some bugs

# 0.2.0 / 2016-05-03

- Remove useless apis. Close #4

# 0.1.0 / 2016-04-06

- Add functions to `api.user`
- Add functions to `api.question`
- Add functions to `api.topic`
- Add functions to `api.action`
- Add test cases

# 0.0.2 / 2016-03-11

- Add `api.user`
- Add `api.question`

# 0.0.1 / 2016-03-11

- Initial release
