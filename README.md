# Reviews CLI

A command-line tool to help manage GitHub pull request reviews and reviewer assignments.

## Installation

This tool requires Node. Only tested on v20 and v22, but v18 probably works too.

```bash
npm install -g @dave-bernhard/reviews-cli
```

## Usage

### List Review Requests

View the number of open review requests for each team member:

```bash
reviews list
```

### Assign Reviewers

Assign reviewers to your current pull request:

```bash
reviews assign
```

This command will:
1. Find your current branch's pull request
2. Show you a list of potential reviewers
3. Allow you to select reviewers
4. Add/remove reviewers as needed

### Configure

Set up your GitHub configuration. You will have to do this se the CLI knows which repo and org to look at.
You can also choose your "favourite" reviewers. These will appear at the top when org members are listed.

Configuration is saved to `~/.reviews/config.json` and is removed with the `reviews clean` command.

```bash
reviews configure
```

### Login

Authenticate with GitHub:

```bash
reviews login
```

The tool currently requires a Personal Access Token (PAT) for Github.

### Clean

Remove all configuration data:

```bash
reviews clean
```
