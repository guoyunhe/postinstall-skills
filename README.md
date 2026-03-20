# postinstall-skills

Add a `postinstall` script to your NPM package. When others install your package, your skills will be copied to their project.

```bash
npm i -S postinstall-skills
```

package.json

```json
{
  "scripts": {
    "postinstall": "postinstall-skills"
  }
}
```
