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
		//var_dump($this->request);
        if (isset($_REQUEST['start'])) {
            $this->startDate = $_REQUEST['start'];
            $this->endDate = $_REQUEST['end'];
            $res->data = Event::range($this->startDate, $this->endDate);
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
			if ($rec =  Event::create($this->params)) {
				$res->success = true;
				$res->data = $rec->to_hash();
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
			if ($rec = Event::update($this->params->id, $this->params)) {
				$res->data = $rec->to_hash();

				// SIMULATE ERROR:  All records having odd-numbered ID have error.
				if ($rec->id % 2) {
					$res->success = false;
					$res->message = "SIMULATED ERROR:  Lorem ipsum dolor sit amet, placerat consectetuer, nec lacus imperdiet velit dui interdum vestibulum, sagittis lectus morbi, urna aliquet minus natoque commodo egestas non, libero libero arcu sed sed.";
				} else {
					$res->success = true;
					$res->message = "Updated record";
				}
			} else {
				$res->message = "Failed to updated record " . $this->params->id;
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
			if ($rec = Event::destroy($this->id)) {
				$res->message = "Destroyed event";
				$res->success = true;
			} else {
				$res->message = "Failed to Destroy event";
			}
		}
		return $res->to_json();
	}
}

