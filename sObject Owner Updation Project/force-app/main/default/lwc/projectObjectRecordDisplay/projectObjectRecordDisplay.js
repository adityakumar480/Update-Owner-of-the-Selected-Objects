import { LightningElement, wire } from "lwc";
import { subscribe, MessageContext } from "lightning/messageService";
import JSON_PASSING_CHANNEL from "@salesforce/messageChannel/Passing_JSON__c";

const leadColumns = [
  {
    label: "Name",
    fieldName: "leadUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "Name" },
      target: "_blank"
    }
  },
  { label: "Source", fieldName: "LeadSource", type: "text", sortable: "true" },
  { label: "Status", fieldName: "Status", type: "text", sortable: "true" },
  { label: "Created Date", fieldName: "CreatedDate", sortable: "true" }
];

const accountColumns = [
  {
    label: "Name",
    fieldName: "accountUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "Name" },
      target: "_blank"
    }
  },
  { label: "Rating", fieldName: "Rating", type: "text", sortable: "true" },
  {
    label: "Account Source",
    fieldName: "AccountSource",
    type: "text",
    sortable: "true"
  },
  { label: "Created Date", fieldName: "CreatedDate", sortable: "true" }
];

const contactColumns = [
  {
    label: "Name",
    fieldName: "contactUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "Name" },
      target: "_blank"
    }
  },
  {
    label: "Associated Account",
    fieldName: "contactAccountUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "accountName" },
      target: "_blank"
    }
  },
  { label: "Phone", fieldName: "Phone", type: "phone", sortable: "true" },
  { label: "Created Date", fieldName: "CreatedDate", sortable: "true" }
];

const caseColumns = [
  {
    label: "Case Number",
    fieldName: "caseUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "CaseNumber" },
      target: "_blank"
    }
  },
  { label: "Case Origin", fieldName: "Origin", type: "text", sortable: "true" },
  {
    label: "Associated Account",
    fieldName: "caseAccountUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "caseAccountName" },
      target: "_blank"
    }
  },
  {
    label: "Associated Contact",
    fieldName: "caseContactUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "caseContactName" },
      target: "_blank"
    }
  },
  { label: "Created Date", fieldName: "CreatedDate", sortable: "true" }
];

const opportunityColumns = [
  {
    label: "Name",
    fieldName: "opportunityUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "Name" },
      target: "_blank"
    }
  },
  {
    label: "Associated Account",
    fieldName: "opportunityAccountUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "opportunityAccountName" },
      target: "_blank"
    }
  },
  {
    label: "Stage Name",
    fieldName: "StageName",
    type: "text",
    sortable: "true"
  },
  {
    label: "Close Date",
    fieldName: "CloseDate",
    type: "date",
    sortable: "true"
  },
  { label: "Created Date", fieldName: "CreatedDate", sortable: "true" }
];

export default class ProjectObjectRecordDisplay extends LightningElement {
  @wire(MessageContext)
  messageContext;
  subscription;

  updatedObjectRecords = [];

  selectedObject;
  selectedFromUserName;
  selectedToUserName;
  sortedBy;
  sortedDirection;

  isDisplaySpinner = false;

  get isDisplayUpdatedSection() {
    return this.updatedObjectRecords.length > 0;
  }

  get cardIcon() {
    switch (this.selectedObject) {
      case "Lead":
        return "standard:lead";
      case "Account":
        return "standard:account";
      case "Contact":
        return "standard:contact";
      case "Opportunity":
        return "standard:opportunity";
      case "Case":
        return "standard:case";
      default:
        return "standard:avatar";
    }
  }

  get columns() {
    switch (this.selectedObject) {
      case "Lead":
        return leadColumns;
      case "Account":
        return accountColumns;
      case "Contact":
        return contactColumns;
      case "Opportunity":
        return opportunityColumns;
      case "Case":
        return caseColumns;
      default:
        return [];
    }
  }

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      JSON_PASSING_CHANNEL,
      (message) => this.handleMessage(message)
    );
  }

  handleMessage(message) {
    this.isDisplaySpinner = true;

    this.selectedFromUserName = message.fromUserName;
    this.selectedToUserName = message.toUserName;
    this.selectedObject = message.sObjectName;
    this.updatedObjectRecords = JSON.parse(message.sObjectRecords);

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.isDisplaySpinner = false;
    }, 2000);
  }

  handleOnSort(event) {
    const { fieldName, sortDirection } = event.detail;

    this.sortedBy = fieldName;
    this.sortedDirection = sortDirection;

    this.updatedObjectRecords = this.getSortedRecordsByField(
      fieldName,
      sortDirection
    );
  }

  getSortedRecordsByField(fieldName, direction) {
    const sObjectRecords = JSON.parse(
      JSON.stringify(this.updatedObjectRecords)
    );

    sObjectRecords.sort((a, b) => {
      const valueA = a[fieldName] || "";
      const valueB = b[fieldName] || "";

      return direction === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
          ? 1
          : -1;
    });

    return sObjectRecords;
  }
}
