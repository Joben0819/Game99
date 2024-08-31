require('draftlog').into(console);
const fs = require('fs');
const chalk = require('chalk');
const path = '.next';

let startRemovingText = console.draft('Start removing .next...');

// Define color codes
const colors = {
  customBlue: '\x1b[38;2;70;147;236m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

// Function to log with color
function logWithColor(color, message) {
  console.log(color, message, colors.reset);
}

// Input progress goes from 0 to 100
function ProgressBar(progress) {
  // Make it 50 characters length
  progress = Math.min(100, progress);
  var units = Math.round(progress / 2);
  return (
    chalk.dim('[') +
    chalk.blue('=').repeat(units) +
    ' '.repeat(50 - units) +
    chalk.dim('] ') +
    chalk.yellow(progress + '%')
  );
}

function LoadingText(text) {
  var draft = console.draft();
  var t = text.split('');
  var j = '';
  var elapsed = 0;
  const textInterval = setInterval(() => {
    if (t.length === elapsed) {
      clearInterval(textInterval);
    } else {
      j += t[elapsed++];
    }
    draft(chalk.blue(j));
  }, 5);
}

function startLoadingText() {
  console.log();
  LoadingText('         █████╗  █████╗       ██╗   ██╗██████╗ ');
  setTimeout(() => {
    LoadingText('        ██╔══██╗██╔══██╗      ██║   ██║╚════██╗');
  }, 195);
  setTimeout(() => {
    LoadingText('        ╚██████║╚██████║█████╗██║   ██║ █████╔╝');
  }, 390 );
  setTimeout(() => {
    LoadingText('         ╚═══██║ ╚═══██║╚════╝╚██╗ ██╔╝██╔═══╝ ');
  }, 585);
  setTimeout(() => {
    LoadingText('         █████╔╝ █████╔╝       ╚████╔╝ ███████╗');
  }, 780);
  setTimeout(() => {
    LoadingText('         ╚════╝  ╚════╝         ╚═══╝  ╚══════╝');
  }, 975);
}

// Always performs the removal action of .next
if (fs.existsSync(path)) {
  fs.rmSync(path, { recursive: true, force: true });
  startDownload();
} else {
  logWithColor(colors.yellow, '.next directory not found, skipping removal ⚠️');
  startLoadingText();
}

function startDownload() {
  var barLine = console.draft('Wait...');
  var progress = 0;
  var interval = setInterval(function () {
    // To add random speed, we use random:
    progress += Math.round(Math.random() * 5);

    // Update bar
    barLine(ProgressBar(progress));

    // Check ended
    if (progress >= 100) {
      barLine(ProgressBar(progress));
      startRemovingText('Removed .next directory ✅');
      startLoadingText();
      clearInterval(interval);
    }
  }, 15);
}
