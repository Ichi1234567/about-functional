import { spawn } from 'child_process';
import prompts from 'prompts';

function spawnPromise(cmd) {
  let theResolve;
  let theReject;
  const thePromise = new Promise((resolve, reject) => {
    theResolve = resolve;
    theReject = reject;
  });
  const ins = spawn(cmd, {
    shell: true,
    stdio: 'inherit',
  });

  ins.on('close', () => {
    theResolve();
  });

  ins.on('error', () => {
    theReject();
  });

  return thePromise;
}

async function main() {
  const { value: theSlideName } = await prompts({
    type: 'text',
    name: 'value',
    message: 'Which slide would you build?',
    validate: value => value.length > 0,
  });

  // build slides
  const cmdMarp = `marp src/${theSlideName} -o slides/${theSlideName}/index.html --html`;

  spawnPromise(cmdMarp).then(() => {
    console.log('DONE - marp');
  });

  // copy images
  const destAssets = `slides/${theSlideName}/assets`;
  const cmdCp = `mkdir -p "${destAssets}" && cp -R src/${theSlideName}/assets/images ${destAssets}`;

  spawnPromise(cmdCp).then(() => {
    console.log('DONE - clone assets');
  });
}

main();
