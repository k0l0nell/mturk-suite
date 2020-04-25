const changeLog = [];

changeLog.push({
  version: '2.7.01',
  date: 'from bdesmeijter',
  'HIT Catcher': [
    'Added Support for grouping HITS and pausing groups ',
  ],
  'HIT Tracker': ['Added more measures','re-organised tables and moved to tabs ']
})

changeLog.push({
  version: 'Announcement',
  date: 'from Kadauchi',
  'Turkerview': [
    'You do NOT need to subscribe to Turkerview to use MTurk Suite.',
  ]
})

changeLog.push({
  version: '2.6.12',
  date: 'Friday, May 17, 2019',
  'HIT Finder': [
    'New buttons [O|P] should now properly change color when clicked.'
  ],
  'General':[
    'Added content script to listen to the new built in HIT Catcher buttons on HIT Notifier'
  ]
})

changeLog.push({
  version: '2.6.11',
  date: 'Wednesday, May 15, 2019',
  'HIT Finder': [
    'New buttons [O|P] added to send HITs directly to HIT Catcher.'
  ],
})

changeLog.push({
  version: '2.6.10',
  date: 'Friday, May 10, 2019',
  'HIT Catcher': [
    'Fixed the random freezing issue.'
  ],
})

changeLog.push({
  version: '2.6.9',
  date: 'Wednesday, April 3, 2019',
  'General': [
    'Fix for Turkopticon?',
    'Requester links for markdown exports have been fixed.'
  ],
})


changeLog.push({
  version: '2.6.8',
  date: 'Friday, March 22, 2019',
  'General': [
    'Another attempt to fix reviews not appearing by disabling TO2.',
    'Workspace expander should now focus the iframe correctly.'
  ],
  'Turkerview': [
    'Don\'t duplicate detailed HIT breakdown overlays if TVJS exists.'
  ]
})

changeLog.push({
  version: '2.6.7',
  date: 'Tuesday, March 5, 2019',
  'Requester Reviews': [
    'Fixed issue that caused reviews not to appear.'
  ]
})

changeLog.push({
  version: '2.6.6',
  date: 'Tuesday, March 5, 2019',
  'HIT Exporting': [
    'Requester links will now work properly.'
  ],
  'Turkerview': [
    'Endless call loop fixed.',
    'Fixed return warning issue with Inquisit tasks.'
  ]
})


changeLog.push({
  version: '2.6.5',
  date: 'Sunday, Februrary 24, 2019',
  'HIT Exporting': [
    'Remaining HIT export issues should now be resolved.'
  ]
})

changeLog.push({
  version: '2.6.4',
  date: 'Monday, Februrary 11, 2019',
  'HIT Exporting': [
    'Fixed export issues caused by the recent updates.',
    'Fixed issue trying to export from the queue.'
  ]
})

changeLog.push({
  version: '2.6.3',
  date: 'Tuesday, Februrary 5, 2019',
  'HIT Finder': [
    'Rows will be colored by TV first then TO.',
    'Row colors shouldn\'t be more stable now.',
    'Fixed issue with old review stats showing if the requester had no reviews.'
  ]
})

changeLog.push({
  version: '2.6.2',
  date: 'Monday, Februrary 4, 2019',
  'HIT Finder': [
    'Rows colored by TV first then TO vs before where TV would never color. More options to come soon for row coloring.',
    'TV ratings should still display in the popup even if TO is disabled or lagging behind in updates.'
  ]
})

changeLog.push({
  version: '2.6.1',
  date: 'Monday, Februrary 4, 2019',
  'HIT Finder': [
    'MTS options for Turkerview and Turkopticon will now enable/disabled the correct thing in HIT Finder',
    'Fixed the coloring issue for rows that was introduced in the last update.'
  ],
  'Turkerview': [
    'Fixed the TO/TV hot-swap going on in HIT Finder.',
    'Fixed perma-display of API notices for users who entered their API key.',
    'Fixed language in TV HF announcement to be more clear MTS will be fine without TV.',
    'Fixed return warnings',
    'Fixed a bug w/ display of Connected! alert'
  ]
})

changeLog.push({
  version: '2.6.0',
  date: 'Monday, Februrary 4, 2019',
  'General': [
    'Split Turkerview and Turkopticon.',
    'New cache system for Turkopticion to increase reliabiliy and reduce their server strain.',
    'Reviews should now appear again under the "Status Detail" pages.'
  ]
})

changeLog.push({
  version: '2.5.1',
  date: 'Thursday, January 31, 2019',
  'General': [
    'Fix for issue that was causing HIT Finder to freeze.',
  ]
})

changeLog.push({
  version: '2.5.0',
  date: 'Wednesday, January 30, 2019',
  'General': [
    'Updated for Turkerview\'s incoming API changes.',
  ]
})

changeLog.push({
  version: '2.4.6',
  date: 'Thursday, December 20, 2018',
  'General': [
    'HIT Exporter Fix: TurkerView Forum direct exports should now work (TurkerHub).',
  ]
})

changeLog.push({
  version: '2.4.5',
  date: 'Saturday, December 1, 2018',
  'General': [
    'Fix: Some HITs that were being completely hidden by Workspace Expander are now visible.',
  ]
})

changeLog.push({
  version: '2.4.4',
  date: 'Saturday, December 1, 2018',
  'General': [
    'Fix: The footer that has been floating into the workspace when Workspace Expander is enabled has been fixed.',
  ]
})

changeLog.push({
  version: '2.4.3',
  date: 'Tuesday, November 20, 2018',
  'General': [
    'Fix: Workspace Expander should expand everything properly now.',
  ]
})

changeLog.push({
  version: '2.4.2',
  date: 'Saturday, November 17, 2018',
  'General': [
    'Fix: The floating footer should no longer be an issue when Workspace expander is enabled.',
  ]
})

changeLog.push({
  version: '2.4.1',
  date: 'Wednesday, November 14, 2018',
  'General': [
    'Fix: No longer required to type something into the promp box for direct exports.',
    'Fix: Fixed the duration formatting on exports.'
  ]
})

changeLog.push({
  version: '2.4.0',
  date: 'Saturday, October 6, 2018',
  'New Feature: Block Masters': [
    'Block HITs that require Masters if you don\'t have the qualification.'
  ]
})

changeLog.push({
  version: '2.3.12',
  date: 'Saturday, September 15, 2018',
  'HIT Catcher': [
    'Fix: No longer incorrectly pauses and announces you are logged out when experiencing network difficulties.'
  ]
})

changeLog.push({
  version: `2.3.11`,
  date: `Sunday, September 8, 2018`,
  "HIT Catcher": [
    "Fix: Will no longer pause/announce logged out after catching any HIT when not logged out.",
  ],
  "General": [
    "Fix: Blocklist will now show if Block Location is turned off."
  ]
});

changeLog.push({
  version: `2.3.10`,
  date: `Sunday, September 8, 2018`,
  "New Feature: Block Location": [
    'Block HITs that you do not meet the location qualification for.',
  ],
  "HIT Catcher": [
    "Fix: Should announce when logged out again.",
  ],
  "General": [
    "Cache TTS voice."
  ]
});

changeLog.push({
  version: `2.3.9`,
  date: `Tuesday, August 28, 2018`,
  "HIT Catcher": [
    'Avoid selecting the voice for Text to Speech unnecessarily',
    'Avoid parsing for infomation about a HIT if we already got it.'
  ]
});


changeLog.push({
  version: `2.3.8`,
  date: `Wednesday, August 22, 2018`,
  "General": [
    'Firefox: Fix for pending earnings link trying to go to a Chrome URL.'
  ]
});


changeLog.push({
  version: `2.3.7`,
  date: `Sunday, July 1, 2018`,
  "HIT Tracker": [
    'Week ranges are no longer hardcoded and will no longer require updates to fix.'
  ]
});

changeLog.push({
  version: `2.3.6`,
  date: `Thursday, May 31, 2018`,
  General: [
    `HIT Catcher buttons for missed HITs now have a fallback for slower load times fixing issues where they would not show up for some.`
  ]
});

changeLog.push({
  version: `2.3.5`,
  date: `Tuesday, May 29, 2018`,
  General: [
    `Block List On MTurk now works on requester pages.`
  ]
});

changeLog.push({
  version: `2.3.4`,
  date: `Monday, May 28, 2018`,
  General: [
    `Input Worker Id working again for Firefox`,
    `HIT Tracker earnings are updating live corretly again.`
  ]
});

changeLog.push({
  version: `2.3.3`,
  date: `Monday, May 28, 2018`,
  General: [
    `HIT Catcher buttons for missed HITs should be fixed for everyone`
  ],
  "HIT Finder": [`Fixed issue when an Include List match was found with notifications enabled causing Finder to stall.`]
});

changeLog.push({
  version: `2.3.2`,
  date: `Monday, May 28, 2018`,
  "HIT Finder": [`Requester reviews are now updating again.`]
});

changeLog.push({
  version: `2.3.1`,
  date: `Sunday, May 27, 2018`,
  General: [
    `Fixed HIT Tracker Live Update, will now properly update when you submit or sync.`,
    `HIT Catcher Once and Panda buttons when you miss a HIT are back from vacation.`,
    `Remember Filter fixed.`,
    `Pagination Last Page now always links to the correct page.`
  ]
});

changeLog.push({
  version: `2.3`,
  date: `Sunday, May 27, 2018`,
  MTS: [
    `Options have been RESET!`,
    `New toggles for HIT Tracker stuff on MTurk.`,
    `Right clicking the icon now has links to launch Finder, Catcher and Tracker.`
  ],
  General: [
    `Auto Accept Checker removed. MTurk's new default is alway checked.`,
    `Auto Accept Unchecker added.`,
    `Requester Review icon changed.`,
    `HIT Exporter icon changed.`,
    `HIT Tracker icons for no work found have been removed.`,
    `Popovers now have a 500ms activation time instead of instant.`,
    `HIT Exporter changed from modal to popover.`,
    `You can now view and edit your Block List directly on MTurk`
  ],
  "HIT Tracker": [`Weekly range for June done.`]
});

changeLog.push({
  version: `2.2.3`,
  date: `Sunday, April 8, 2018`,
  General: [
    `HIT Exporter should no longer break on direct exports if there is a special character on the export.`,
    `HIT Exporter Direct export options now have the option to leave a message along with the `,
    `HIT Exporter contact links now properly link to the correct constact requester URL.`
  ]
});

changeLog.push({
  version: `2.2.3`,
  date: `Sunday, April 8, 2018`,
  "HIT Finder": [`Fix for notifications not showing in Firefox.`]
});

changeLog.push({
  version: `2.2.2`,
  date: `Tuesday, April 2, 2018`,
  "HIT Finder": [`MTC Direct Export working again.`]
});

changeLog.push({
  version: `2.2.1`,
  date: `Tuesday, April 2, 2018`,
  "HIT Finder": [`HIT Exports working again.`]
});

changeLog.push({
  version: `2.2.0`,
  date: `Saturday, March 31, 2018`,
  General: [
    `Updates will now trigger a desktop notification.`,
    `Input Worker ID now working properly on all frames.`
  ],
  "HIT Tracker": [
    `All of April's 2018 weekly ranges hardcoded while a permanent solution is being made.`,
    `Sundays will now show Projected Earnings Last Week`
  ]
});

changeLog.push({
  version: `2.1.19`,
  "HIT Tracker": [`Week range updated.`]
});

changeLog.push({
  version: `2.1.18`,
  "HIT Tracker": [`Week range updated.`]
});

changeLog.push({
  version: `2.1.17`,
  date: `Monday, March 12, 2018`,
  "HIT Tracker": [`Week range updated.`]
});

changeLog.push({
  version: `2.1.16`,
  date: `Thursday, March 8, 2018`,
  "HIT Tracker": [
    `Fixed backup import issue (re-import to fix if you imported a backup on v2.1.15).`
  ]
});

changeLog.forEach(changes => {
  const card = document.createElement(`div`);
  card.className = `card mt-1`;

  const header = document.createElement(`div`);
  header.className = `card-header bg-primary text-white`;
  card.appendChild(header);

  const version = document.createElement(`span`);
  version.textContent = changes.version;
  header.appendChild(version);

  const date = document.createElement(`small`);
  date.className = `ml-1`;
  date.textContent = changes.date;
  header.appendChild(date);

  const block = document.createElement(`div`);
  block.className = `card-block`;
  card.appendChild(block);

  const listGroup = document.createElement(`div`);
  listGroup.className = `list-group`;
  block.appendChild(listGroup);

  Object.keys(changes).forEach(item => {
    const change = changes[item];

    if (Array.isArray(change)) {
      const groupItem = document.createElement(`div`);
      groupItem.className = `list-group-item flex-column align-items-start`;
      listGroup.appendChild(groupItem);

      const category = document.createElement(`h5`);
      category.className = `d-flex w-100 justify-content-between`;
      category.textContent = item;
      groupItem.appendChild(category);

      const changeList = document.createElement(`ul`);
      groupItem.appendChild(changeList);

      change.forEach(text => {
        const changeListBullet = document.createElement(`li`);
        changeListBullet.textContent = text;
        changeList.appendChild(changeListBullet);
      });
    }
  });

  document.getElementsByClassName(`container`)[0].appendChild(card);
});
