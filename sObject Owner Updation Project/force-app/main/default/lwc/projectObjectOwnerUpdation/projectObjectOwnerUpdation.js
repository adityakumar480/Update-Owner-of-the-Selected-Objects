import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import JSON_PASSING_CHANNEL from "@salesforce/messageChannel/Passing_JSON__c";

import LEAD_OBJECT from "@salesforce/schema/Lead";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import OPPORTUNITY_OBJECT from "@salesforce/schema/Opportunity";
import CASE_OBJECT from "@salesforce/schema/Case";

import LEAD_ID_FIELD from "@salesforce/schema/Lead.Id";
import LEAD_NAME_FIELD from "@salesforce/schema/Lead.Name";
import LEAD_LEAD_SOURCE_FIELD from "@salesforce/schema/Lead.LeadSource";
import LEAD_STATUS_FIELD from "@salesforce/schema/Lead.Status";
import LEAD_OWNER_ID_FIELD from "@salesforce/schema/Lead.OwnerId";
import LEAD_CREATED_DATE_FIELD from "@salesforce/schema/Lead.CreatedDate";

import ACCOUNT_ID_FIELD from "@salesforce/schema/Account.Id";
import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_RATING_FIELD from "@salesforce/schema/Account.Rating";
import ACCOUNT_SOURCE_FIELD from "@salesforce/schema/Account.AccountSource";
import ACCOUNT_OWNER_ID_FIELD from "@salesforce/schema/Account.OwnerId";
import ACCOUNT_CREATED_DATE_FIELD from "@salesforce/schema/Account.CreatedDate";

import CONTACT_ID_FIELD from "@salesforce/schema/Contact.Id";
import CONTACT_NAME_FIELD from "@salesforce/schema/Contact.Name";
import CONTACT_ACCOUNT_ID_FIELD from "@salesforce/schema/Contact.AccountId";
import CONTACT_EMAIL_FIELD from "@salesforce/schema/Contact.Email";
import CONTACT_PHONE_FIELD from "@salesforce/schema/Contact.Phone";
import CONTACT_OWNER_ID_FIELD from "@salesforce/schema/Contact.OwnerId";
import CONTACT_CREATED_DATE_FIELD from "@salesforce/schema/Contact.CreatedDate";

import OPPORTUNITY_ID_FIELD from "@salesforce/schema/Opportunity.Id";
import OPPORTUNITY_NAME_FIELD from "@salesforce/schema/Opportunity.Name";
import OPPORTUNITY_ACCOUNT_ID_FIELD from "@salesforce/schema/Opportunity.AccountId";
import OPPORTUNITY_STAGE_NAME_FIELD from "@salesforce/schema/Opportunity.StageName";
import OPPORTUNITY_CLOSE_DATE_FIELD from "@salesforce/schema/Opportunity.CloseDate";
import OPPORTUNITY_OWNER_ID_FIELD from "@salesforce/schema/Opportunity.OwnerId";
import OPPORTUNITY_CREATED_DATE_FIELD from "@salesforce/schema/Opportunity.CreatedDate";

import CASE_ID_FIELD from "@salesforce/schema/Case.Id";
import CASE_CASE_NUMBER_FIELD from "@salesforce/schema/Case.CaseNumber";
import CASE_ORIGIN_FIELD from "@salesforce/schema/Case.Origin";
import CASE_ACCOUNT_ID_FIELD from "@salesforce/schema/Case.AccountId";
import CASE_CONTACT_ID_FIELD from "@salesforce/schema/Case.ContactId";
import CASE_OWNER_ID_FIELD from "@salesforce/schema/Case.OwnerId";
import CASE_CREATED_DATE_FIELD from "@salesforce/schema/Case.CreatedDate";

import getAllAdministratorUsers from "@salesforce/apex/ObjectOwnerUpdationController.getAllAdministratorUsers";
import getsObjectRecordsByUserId from "@salesforce/apex/ObjectOwnerUpdationController.getsObjectRecordsByUserId";
import updateOwnerOfsObjects from "@salesforce/apex/ObjectOwnerUpdationController.updateOwnerOfsObjects";

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
    label: "Account Name",
    fieldName: "caseAccountUrl",
    type: "url",
    sortable: "true",
    typeAttributes: {
      label: { fieldName: "caseAccountName" },
      target: "_blank"
    }
  },
  {
    label: "Contact Name",
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

export default class ProjectObjectOwnerUpdation extends LightningElement {
  @wire(MessageContext)
  messageContext;

  sObjects = [
    LEAD_OBJECT.objectApiName,
    ACCOUNT_OBJECT.objectApiName,
    CONTACT_OBJECT.objectApiName,
    OPPORTUNITY_OBJECT.objectApiName,
    CASE_OBJECT.objectApiName
  ];
  sObjectFields = {
    Lead: [
      LEAD_ID_FIELD.fieldApiName,
      LEAD_NAME_FIELD.fieldApiName,
      LEAD_LEAD_SOURCE_FIELD.fieldApiName,
      LEAD_STATUS_FIELD.fieldApiName,
      LEAD_OWNER_ID_FIELD.fieldApiName,
      LEAD_CREATED_DATE_FIELD.fieldApiName
    ],
    Account: [
      ACCOUNT_ID_FIELD.fieldApiName,
      ACCOUNT_NAME_FIELD.fieldApiName,
      ACCOUNT_RATING_FIELD.fieldApiName,
      ACCOUNT_SOURCE_FIELD.fieldApiName,
      ACCOUNT_OWNER_ID_FIELD.fieldApiName,
      ACCOUNT_CREATED_DATE_FIELD.fieldApiName
    ],
    Contact: [
      CONTACT_ID_FIELD.fieldApiName,
      CONTACT_NAME_FIELD.fieldApiName,
      CONTACT_ACCOUNT_ID_FIELD.fieldApiName,
      CONTACT_PHONE_FIELD.fieldApiName,
      CONTACT_EMAIL_FIELD.fieldApiName,
      CONTACT_OWNER_ID_FIELD.fieldApiName,
      CONTACT_CREATED_DATE_FIELD.fieldApiName
    ],
    Opportunity: [
      OPPORTUNITY_ID_FIELD.fieldApiName,
      OPPORTUNITY_NAME_FIELD.fieldApiName,
      OPPORTUNITY_ACCOUNT_ID_FIELD.fieldApiName,
      OPPORTUNITY_STAGE_NAME_FIELD.fieldApiName,
      OPPORTUNITY_CLOSE_DATE_FIELD.fieldApiName,
      OPPORTUNITY_OWNER_ID_FIELD.fieldApiName,
      OPPORTUNITY_CREATED_DATE_FIELD.fieldApiName
    ],
    Case: [
      CASE_ID_FIELD.fieldApiName,
      CASE_CASE_NUMBER_FIELD.fieldApiName,
      CASE_ORIGIN_FIELD.fieldApiName,
      CASE_ACCOUNT_ID_FIELD.fieldApiName,
      CASE_CONTACT_ID_FIELD.fieldApiName,
      CASE_OWNER_ID_FIELD.fieldApiName,
      CASE_CREATED_DATE_FIELD.fieldApiName
    ]
  };

  users = [];
  sObjectRecords = [];
  selectedRecords = [];
  sObjectRecordsForUpdation = [];
  sObjectRecordsForPassing = [];

  selectedObject;
  selectedToUserId;
  selectedFromUserId;
  sortedBy;
  sortedDirection;

  isDisplaySpinner = false;

  get sObjectOptions() {
    return [
      { label: "--NONE--", value: "" },
      ...(this.sObjects ?? []).map((object) => ({
        label: object,
        value: object
      }))
    ];
  }

  get isDisableObjectCombobox() {
    return this.selectedObject ? true : false;
  }

  get isDisableToUserCombobox() {
    return this.selectedFromUserId ? false : true;
  }

  get isDisableUpdateButton() {
    return (
      !this.selectedFromUserId ||
      !this.selectedToUserId ||
      this.selectedFromUserId === this.selectedToUserId
    );
  }

  get isDisplayObjectRecords() {
    return !!(this.selectedFromUserId && this.sObjectRecords.length > 0);
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
    getAllAdministratorUsers()
      .then((response) => {
        this.users = response;
      })
      .catch((error) => {
        this.handleNotification("Error", error.body.message, "error");
      });
  }

  handleElementChange(event) {
    const { name, value } = event.target;

    if (name === "sObjectSelection") {
      this.selectedObject = value;
    } else if (name === "fromUserSelection") {
      this.selectedFromUserId = value;
      this.validateSelectedUser(name);

      this.validateSelectedUserIsDuplicate({
        userType: name,
        hardCoded: false
      });
      this.validateSelectedUserIsDuplicate({
        userType: "toUserSelection",
        hardCoded: true
      });

      this.getSelectedsObjectRecords(value);
    } else if (name === "toUserSelection") {
      this.selectedToUserId = value;
      this.validateSelectedUser(name);

      this.validateSelectedUserIsDuplicate({
        userType: name,
        hardCoded: false
      });
      this.validateSelectedUserIsDuplicate({
        userType: "fromUserSelection",
        hardCoded: true
      });
    }
  }

  handleOwnerUpdation() {
    if (this.validatesObjectRecords()) {
      this.isDisplaySpinner = true;

      updateOwnerOfsObjects({
        fromUserId: this.selectedFromUserId,
        toUserId: this.selectedToUserId,
        sObjectRecordsForUpdation: this.sObjectRecordsForUpdation
      })
        .then((response) => {
          const selectedFromUser = this.users.find(
            (user) => user.value === this.selectedFromUserId
          );
          const selectedToUser = this.users.find(
            (user) => user.value === this.selectedToUserId
          );

          if (response === "SUCCESS") {
            publish(this.messageContext, JSON_PASSING_CHANNEL, {
              fromUserName: selectedFromUser?.label || "Username not found",
              toUserName: selectedToUser?.label || "Username not found",
              sObjectName: this.selectedObject,
              sObjectRecords: JSON.stringify(this.sObjectRecordsForPassing)
            });

            this.handleRefreshComponent();
            this.handleNotification(
              "SUCCESS",
              "Owner updated successfully...",
              "success"
            );
          }
        })
        .catch((error) => {
          this.handleNotification(
            error.body.exceptionType,
            error.body.message,
            "error"
          );
        })
        .finally(() => {
          this.isDisplaySpinner = false;
        });
    }
  }

  handleRefreshComponent() {
    this.selectedObject = null;
    this.selectedToUserId = null;
    this.selectedFromUserId = null;

    this.sObjectRecords = [];
    this.selectedRecords = [];
    this.sObjectRecordsForUpdation = [];
    this.sObjectRecordsForPassing = [];
  }

  handleRowSelection(event) {
    const selectedRows = event.detail?.selectedRows ?? [];

    this.sObjectRecordsForUpdation = selectedRows.map((row) => ({
      Id: row.Id,
      OwnerId: row.OwnerId
    }));
    this.sObjectRecordsForPassing = [...selectedRows];
  }

  handleOnSort(event) {
    const { fieldName, sortDirection } = event.detail;

    this.sortedBy = fieldName;
    this.sortedDirection = sortDirection;

    this.sObjectRecords = this.getSortedRecordsByField(
      fieldName,
      sortDirection
    );
  }

  handleNotification(title, message, variant, mode = "dismissable") {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant,
        mode
      })
    );
  }

  validateSelectedUser(userType) {
    const userIdByUserType = {
      fromUserSelection: this.selectedFromUserId,
      toUserSelection: this.selectedToUserId
    };

    const comboboxElement = this.template.querySelector(`.${userType}`);
    comboboxElement.setCustomValidity(
      userIdByUserType[userType] ? "" : "Please select a user..."
    );
    comboboxElement.reportValidity();
  }

  validateSelectedUserIsDuplicate(userTypeDetail) {
    const hasSameUser =
      this.selectedFromUserId &&
      this.selectedToUserId &&
      this.selectedFromUserId === this.selectedToUserId;

    const comboboxElement = this.template.querySelector(
      `.${userTypeDetail.userType}`
    );

    if (userTypeDetail.hardCoded) {
      comboboxElement.setCustomValidity("");
    } else {
      if (hasSameUser) {
        this.handleNotification(
          "ERROR || SAME USER",
          "Same user selected...",
          "error"
        );
        comboboxElement.setCustomValidity("Select a different user...");
      } else {
        comboboxElement.setCustomValidity("");
      }
    }

    comboboxElement.reportValidity();
  }

  validatesObjectRecords() {
    if (this.sObjectRecords.length === 0) {
      this.handleNotification(
        "ERROR!!",
        "No record associated with selected User...",
        "error"
      );
      return false;
    }

    if (this.sObjectRecordsForUpdation.length === 0) {
      this.handleNotification(
        "ERROR",
        "Please select at least 1 record...",
        "error"
      );
      return false;
    }

    return true;
  }

  getSelectedsObjectRecords(userId) {
    this.isDisplaySpinner = true;

    const sObjectApiName = this.selectedObject;
    let sObjectFieldsApiNames = (this.sObjectFields[sObjectApiName] ?? []).join(
      ","
    );

    if (sObjectFieldsApiNames.includes("AccountId")) {
      sObjectFieldsApiNames += ",Account.Name";
    }
    if (sObjectFieldsApiNames.includes("ContactId")) {
      sObjectFieldsApiNames += ",Contact.Name";
    }

    try {
      getsObjectRecordsByUserId({
        userId,
        sObjectApiName,
        sObjectFieldsApiNames
      })
        .then((response) => {
          const responseResult = response;

          if (responseResult) {
            if (sObjectApiName === "Lead") {
              this.sObjectRecords = responseResult.map((record) => {
                return {
                  ...record,
                  CreatedDate: this.getFormattedDate(
                    new Date(record.CreatedDate)
                  ),
                  leadUrl: "/" + record.Id
                };
              });
            } else if (sObjectApiName === "Account") {
              this.sObjectRecords = responseResult.map((record) => {
                return {
                  ...record,
                  CreatedDate: this.getFormattedDate(
                    new Date(record.CreatedDate)
                  ),
                  accountUrl: "/" + record.Id
                };
              });
            } else if (sObjectApiName === "Contact") {
              this.sObjectRecords = responseResult.map((record) => {
                return {
                  ...record,
                  CreatedDate: this.getFormattedDate(
                    new Date(record.CreatedDate)
                  ),
                  contactUrl: "/" + record.Id,
                  contactAccountUrl: "/" + record.AccountId,
                  accountName: record.Account.Name
                };
              });
            } else if (sObjectApiName === "Case") {
              this.sObjectRecords = responseResult.map((record) => {
                return {
                  ...record,
                  CreatedDate: this.getFormattedDate(
                    new Date(record.CreatedDate)
                  ),
                  caseUrl: "/" + record.Id,
                  caseAccountUrl: "/" + record.AccountId,
                  caseAccountName: record.Account.Name,
                  caseContactUrl: "/" + record.ContactId,
                  caseContactName: record.Contact.Name
                };
              });
            } else if (sObjectApiName === "Opportunity") {
              this.sObjectRecords = responseResult.map((record) => {
                return {
                  ...record,
                  CreatedDate: this.getFormattedDate(
                    new Date(record.CreatedDate)
                  ),
                  opportunityUrl: "/" + record.Id,
                  opportunityAccountUrl: "/" + record.AccountId,
                  opportunityAccountName: record.Account.Name
                };
              });
            }
          }
        })
        .catch((error) => {
          this.handleNotification("Error", error.body.message, "error");
        })
        .finally(() => {
          this.isDisplaySpinner = false;
        });
    } catch (error) {
      this.isDisplaySpinner = false;
      this.handleNotification("Error", error, "error");
    }
  }

  getFormattedDate(createdDate) {
    return `${this.getTwoDigitValue(createdDate.getMonth() + 1)}/${this.getTwoDigitValue(createdDate.getDate())}/${createdDate.getFullYear()}, ${this.getTwoDigitValue(createdDate.getHours())}:${this.getTwoDigitValue(createdDate.getMinutes())} ${createdDate.getHours() >= 12 ? "PM" : "AM"}`;
  }

  getTwoDigitValue(value) {
    return value?.toString().padStart(2, "0") ?? "";
  }

  getSortedRecordsByField(fieldName, direction) {
    const sObjectRecords = JSON.parse(JSON.stringify(this.sObjectRecords));

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
