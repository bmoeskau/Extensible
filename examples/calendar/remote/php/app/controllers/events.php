<?php
/**
 * @class Events
 * A simple application controller extension
 */
class Events extends ApplicationController {
	/**
	 * view
	 * Retrieves rows from database.
	 */
	public function view() {
		$res = new Response();
		$res->success = true;
		$res->message = "Loaded data";
		
        if (isset($_REQUEST['startDate'])) {
            $_SESSION[$GLOBALS['app_id']]['startDate'] = $_REQUEST['startDate'];
            $_SESSION[$GLOBALS['app_id']]['endDate'] = $_REQUEST['endDate'];
            $res->data = Event::range($_REQUEST['startDate'], $_REQUEST['endDate']);
        } else {
        	$res->data = Event::all();
        }
		return $res->to_json();
	}
	/**
	 * create
	 */
	public function create() {
		$res = new Response();

		// Ugh, php...check if !hash
		if (is_array($this->params) && !empty($this->params) && preg_match('/^\d+$/', implode('', array_keys($this->params)))) {
			foreach ($this->params as $data) {
				array_push($res->data, Event::create($data)->to_hash());
			}
			$res->success = true;
			$res->message = "Created " . count($res->data) . ' records';
		} else {
			if ($rec = Event::create($this->params)) {
				$res->data = $rec;//->to_hash();
                $res->success = true;
                $res->message = "Created record";
			} else {
				$res->success = false;
				$res->message = "Failed to create record";
			}
		}
		return $res->to_json();
	}

	/**
	 * update
	 */
	public function update() {
		$res = new Response();

		if (!get_class($this->params)) {
			$res->data = array();
			foreach ($this->params as $data) {
				if ($rec = Event::update($data->id, $data)) {
					array_push($res->data, $rec->to_hash());
				}
			}
			$res->success = true;
			$res->message = "Updated " . count($res->data) . " records";
		} else {
			if ($rec = Event::update($this->id, $this->params)) {
				$res->data = $rec;//->to_hash();
				$res->success = true;
				$res->message = "Updated record";
			} else {
				$res->message = "Failed to update record " . $this->params->id;
				$res->success = false;
			}

		}
		return $res->to_json();
	}

	/**
	 * destroy
	 */
	public function destroy() {
		$res = new Response();

		if (is_array($this->params)) {
			$destroyed = array();
			foreach ($this->params as $id) {
				if ($rec = Event::destroy($id)) {
					array_push($destroyed, $rec);
				}
			}
			$res->success = true;
			$res->message = 'Destroyed ' . count($destroyed) . ' records';
		} else {
			if ($rec = Event::destroy($this->id, $this->params)) {
                $res->success = true;
                $res->message = "Destroyed record";
			} else {
				$res->message = "Failed to destroy event " . $this->params->id;
			}
		}
		return $res->to_json();
	}
}