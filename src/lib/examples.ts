import { ViewDefinition } from './api';

export const exampleViewDefinitions: { [key: string]: ViewDefinition } = {
  patientDemographics: {
    resourceType: 'ViewDefinition',
    resource: 'Patient',
    select: [{
      column: [
        { name: 'id', type: 'id', path: 'getResourceKey()' },
        { name: 'birthDate', type: 'date', path: 'birthDate' },
        { name: 'family', type: 'string', path: 'name.family' },
        { name: 'given', type: 'string', path: 'name.given' },
        { name: 'gender', type: 'code', path: 'gender' }
      ]
    }]
  },
  encounters: {
    resourceType: 'ViewDefinition',
    resource: 'Encounter',
    select: [{
      column: [
        { name: 'id', type: 'id', path: 'getResourceKey()' },
        { name: 'patient', type: 'reference', path: 'subject.reference' },
        { name: 'status', type: 'code', path: 'status' },
        { name: 'class', type: 'code', path: 'class.code' },
        { name: 'period_start', type: 'dateTime', path: 'period.start' },
        { name: 'period_end', type: 'dateTime', path: 'period.end' }
      ]
    }]
  },
  observations: {
    resourceType: 'ViewDefinition',
    resource: 'Observation',
    select: [{
      column: [
        { name: 'id', type: 'id', path: 'getResourceKey()' },
        { name: 'patient', type: 'reference', path: 'subject.reference' },
        { name: 'status', type: 'code', path: 'status' },
        { name: 'code', type: 'string', path: 'code.coding.code' },
        { name: 'display', type: 'string', path: 'code.coding.display' },
        { name: 'value', type: 'string', path: 'valueQuantity.value' },
        { name: 'unit', type: 'string', path: 'valueQuantity.unit' },
        { name: 'effectiveDateTime', type: 'dateTime', path: 'effectiveDateTime' }
      ]
    }]
  }
};

export const examplePatientResources = [
  {
    resourceType: 'Patient',
    id: 'pt-1',
    name: [{
      use: 'official',
      family: 'Smith',
      given: ['John', 'Michael']
    }],
    gender: 'male',
    birthDate: '1990-01-15'
  },
  {
    resourceType: 'Patient',
    id: 'pt-2',
    name: [{
      use: 'official',
      family: 'Johnson',
      given: ['Mary', 'Elizabeth']
    }],
    gender: 'female',
    birthDate: '1985-03-22'
  }
];