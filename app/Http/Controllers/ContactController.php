<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;
use Statamic\Facades\FormSubmission;


class ContactController extends Controller
{
    public function submit(Request $request)
    {
        // ✅ Validation rules
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    $exists = FormSubmission::query()
                        ->where('form', 'contact')
                        ->where('data->email', $value)
                        ->exists();

                    if ($exists) {
                        $fail('This email has already been submitted.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Save submission to Statamic
        $form = Form::find('contact');

        $form->makeSubmission()
            ->data($request->except('_token'))
            ->save();

        return response()->json([
            'success' => true,
            'message' => 'Thank you! We will contact you shortly.'
        ]);
    }
}
