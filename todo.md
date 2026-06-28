# remember if each of these tasks require an api update or a missing update, just ignore the task. otherwise complete the task and mark them as completed.

[x] in story list item, when a word is long pressed, open a swiplable drawer that will use vocab service to show trasnlations of that word.
[x] create a hook in lesson detail page to load the lesson.
[x] when a story is opened call LessonService.OnLessonSectionCompleted to inform that story has been completed
[x] when a vocab page is opened call LessonService.OnLessonSectionCompleted to inform that story has been completed
[x] when a grammar page is opened call LessonService.OnLessonSectionCompleted to inform that story has been completed
[x] when a grammar test page is completed call LessonService.OnLessonSectionCompleted to inform that story has been completed
[x] when a vocab test page is completed call LessonService.OnLessonSectionCompleted to inform that story has been completed
[x] in story detail page,can you not load the story and instead use the lesson hook to get the already included story.
[x] drop the timestamp from userStoryAudio.
[x] in grammar test page and vocab test page, don't load the tests, instead use the lesson hook to access the test from lesson detail model.
[x] add a page for listing all grammars. (already exists: ListGrammarPage at /grammar route)
[x] after uploading avatar url, use getFileById to show the image.
[x] create a section in settings to show all grammars page.