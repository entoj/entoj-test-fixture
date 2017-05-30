'use strict';

/**
 * Configure
 */
const configuration = {};


// Global settings
configuration.settings =
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
    }
};


// Some helpers
const siteTemplate = '${site.name.urlify()}';
const entityCategoryTemplate = siteTemplate + '/${entityCategory.pluralName.urlify()}';
const entityIdTemplate = entityCategoryTemplate + '/${entityCategory.shortName.urlify()}-${entityId.name.urlify()}';


// Urls
configuration.urls =
{
    root: '',
    siteTemplate: '${root}/' + siteTemplate,
    sitePattern: '^${root}/(?<sites>[\\w\\d_]+)$',
    entityCategoryTemplate: '${root}/' + entityCategoryTemplate,
    entityIdTemplate: '${root}/' + entityIdTemplate
};


// Pathes
configuration.pathes =
{
    root: __dirname,
    cacheTemplate: '${root}/cache',
    sitesTemplate: '${root}/sites',
    siteTemplate: '${sites}/' + siteTemplate,
    entityCategoryTemplate: '${sites}/' + entityCategoryTemplate,
    entityIdTemplate: '${sites}/' + entityIdTemplate
};


/**
 * Export
 * @ignore
 */
module.exports.configuration = configuration;
module.exports.pathToSites = require('path').join(__dirname, 'sites');
module.exports.pathToData = require('path').join(__dirname, 'data');
