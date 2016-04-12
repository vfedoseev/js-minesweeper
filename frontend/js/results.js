'use strict';

let resultsTemplate = require('../templates/results-template.hbs');
/**
 * Object representing the storage interface
 */
let Results = (function() {
    let storageName = '_minesweeper_data_';

    /**
     * Get collected data for previous games from localStorage
     * @private
     */
    function _getFromStorage() {
        let results = window.localStorage.getItem(storageName);

        return results ? JSON.parse(results) : [];
    }

    /**
     * Save new result (seconds)
     * @param result
     */
    function _save(result) {
        let results = _getFromStorage();
        let resultToSave = {
            time: result,
            date: Date.now()
        };

        results.push(resultToSave);
        window.localStorage.setItem(storageName, JSON.stringify(results));
    }

    /**
     * Render current data from storage to simple table
     * @returns {string} table HTML
     */
    function _render() {
        let results = _getFromStorage();
        let totalResults = results.length;
        //Convert date from ms to local format
        results.forEach(function(result, i) {
            result.date = (new Date(result.date)).toLocaleDateString();
            if (i == totalResults -1) { //Mark result as current
                result.current = true;
            }
         });
        //Range results
        results.sort(function(a, b) {
           return a.time - b.time;
        });

        return resultsTemplate({
            results: results
        });
    }

    return {
        save: _save,
        render: _render
    }
})();

module.exports = Results;
