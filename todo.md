- [ ] Add LLM to the context of actions
- [ ] openActionEditor
    - [x] use artifacts to render
    - [ ] diffs
    - [ ] add custom text input for LLM-assisted editing
- [ ] validate actions
  - [ ] imports successfully
  - [ ] type checking
  - [ ] testing
    - [ ] create action to add test cases
- [ ] Add button to stop AI-generation
- [ ] add `idempotent` or `re-runnable` permission to actions
- [ ] editable prompts
- [ ] allow to change models
- [ ] OPFS by default
- [ ] apps
- [ ] sandboxing (iframe?)
  make the sandboxing function receive other functions that the user wants to use inside the sandbox (e.g. db.sql\`...\`), and create a postMessage listener for those functions that will receive their parameters serialized, and then, in the sandboxed world (inside the iframe?) create those same functions, with the same name, but they only serialize their parameters and then send them via postMessage back to the parent and wait (listen) for the serialized result
- [ ] local-first
  - [ ] make DBs sync
  - [ ] sync groups that share actions
- [ ] Render markdown in chat

# Done

- [x] artifacts
  allow js runtime to render HTML elements, and re-render previously rendered elements
