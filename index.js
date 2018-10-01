'use strict';

/**
 * Configure
 */
const configuration =
{
    system:
    {
        breakpoints:
        {
            mobile:
            {
                maxWidth: '320px'
            },
            phablet:
            {
                minWidth: '321px',
                maxWidth: '767px'
            },
            miniTablet:
            {
                minWidth: '768px',
                maxWidth: '1023px'
            },
            tablet:
            {
                minWidth: '1024px',
                maxWidth: '1199px'
            },
            desktop:
            {
                minWidth: '1200px'
            }
        },
        path:
        {
            base: __dirname,
            sites: require('path').join(__dirname, 'sites'),
            data: require('path').join(__dirname, 'data')
        },
        entity:
        {
            categories: [
                    {
                        longName: 'Global',
                        pluralName: 'Global',
                        isGlobal: true,
                        shortName: 'o'
                    },
                    {
                        longName: 'Element'
                    },
                    {
                        longName: 'Module'
                    },
                    {
                        shortName: 'g',
                        longName: 'Module Group'
                    },
                    {
                        longName: 'Template'
                    },
                    {
                        longName: 'Page'
                    }
                ]
        }
    }
};

/**
 * Export
 * @ignore
 */
module.exports.configuration = configuration;
module.exports.pathToBase = __dirname;
module.exports.pathToSites = require('path').join(__dirname, 'sites');
module.exports.pathToData = require('path').join(__dirname, 'data');
module.exports.pathToLibraries = require('path').join(__dirname, 'libraries');
