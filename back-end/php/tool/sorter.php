<?php
/**
 * Sort by watcher
 */
function wcomparer($a, $b) {
    if (isset($a["watchers"]) && isset($b["watchers"])){
        if ($a["watchers"] == $b["watchers"]) {
            return 0;
        }
        return ($a["watchers"] < $b["watchers"]) ? 1 : -1;
    }
    return 0;
}