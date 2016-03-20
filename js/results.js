'use strict';

/**
 * Object representing the storage interface
 */
var Results = (function() {
    let template = _.template(document.getElementById('results-template').innerHTML);
    let storageName = '_minesweeper_data_';

    /**
     * Get collected data for previous games from localStorage
     * @private
     */
    function _getFromStorage() {
        let results = window.localStorage.getItem(storageName);

        results = results ? JSON.parse(results) : [];

        return results;
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

        return template({
            results: results
        });
    }

    return {
        save: _save,
        render: _render
    }
})();
