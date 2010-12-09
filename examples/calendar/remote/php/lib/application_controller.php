<?php
/**
 * @class ApplicationController
 */
class ApplicationController {
    public $request, $id, $params;

    /**
     * dispatch
     * Dispatch request to appropriate controller-action by convention according to the HTTP method.
     */
    public function dispatch($request) {
        $this->request = $request;
        $this->id = $request->id;
        $this->params = $request->params;

        // the client can pass 'fail=true' to force a server error response for testing CUD (not R) actions
        if ($request->fail && $request->method != 'GET') {
        	return '{"success":false,"message":"The remote action could not be completed."}';
        }
        if ($request->isRestful()) {
            return $this->dispatchRestful();
        }
        if ($request->action) {
            return $this->{$request->action}();
        }

        // normal dispatch here.  discover action
    }

    protected function dispatchRestful() {
        switch ($this->request->method) {
            case 'GET':
                return $this->view();
                break;
            case 'POST':
                return $this->create();
                break;
            case 'PUT':
                return $this->update();
                break;
            case 'DELETE':
                return $this->destroy();
                break;
        }
    }
}

