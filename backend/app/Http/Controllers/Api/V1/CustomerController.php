<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\URL;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::query()->latest('id')->paginate(15);

        return CustomerResource::collection($customers);
    }

    public function show(Customer $customer)
    {
        return new CustomerResource($customer);
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->validated());

        $resource = new CustomerResource($customer);
        $location = URL::to('/api/v1/customers/'.$customer->id);

        return $resource->response()->setStatusCode(Response::HTTP_CREATED)->header('Location', $location);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return new CustomerResource($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->noContent();
    }
}
