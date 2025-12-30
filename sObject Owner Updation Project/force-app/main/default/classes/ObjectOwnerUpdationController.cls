public with sharing class ObjectOwnerUpdationController {
  @AuraEnabled(cacheable=true)
  public static List<Constants.LabelByValue> getAllAdministratorUsers() {
    List<Constants.LabelByValue> userDetails = new List<Constants.LabelByValue>();
    userDetails.add(new Constants.LabelByValue('--None--', ''));

    for (User userDetail : [
      SELECT Id, Name
      FROM User
      WHERE Profile.Name = :'System Administrator'
      WITH SECURITY_ENFORCED
    ]) {
      userDetails.add(
        new Constants.LabelByValue(userDetail.Name, userDetail.Id)
      );
    }
    return userDetails;
  }

  @AuraEnabled
  public static List<sObject> getsObjectRecordsByUserId(
    String userId,
    String sObjectApiName,
    String sObjectFieldsApiNames
  ) {
    if (
      String.IsBlank(userId) ||
      String.IsBlank(sObjectApiName) ||
      String.IsBlank(sObjectFieldsApiNames)
    ) {
      return new List<sObject>();
    }

    try {
      String query = 'SELECT ';
      if (sObjectFieldsApiNames.contains('Id,')) {
        query += sObjectFieldsApiNames;
      } else {
        query += 'Id, ' + sObjectFieldsApiNames;
      }
      query +=
        ' FROM ' +
        sObjectApiName +
        ' WHERE OwnerId = :userId LIMIT 50000';

      return Database.queryWithBinds(
        query,
        new Map<String, Object>{ 'userId' => userId },
        AccessLevel.USER_MODE
      );
    } catch (Exception exp) {
      throw new AuraHandledException(exp.getMessage());
    }
  }

  @AuraEnabled
  public static String updateOwnerOfsObjects(
    String fromUserId,
    String toUserId,
    List<sObject> sObjectRecordsForUpdation
  ) {
    try {
      List<Lead> leads = new List<Lead>();
      List<Account> accounts = new List<Account>();
      List<Contact> contacts = new List<Contact>();
      List<Case> cases = new List<Case>();
      List<Opportunity> opportunities = new List<Opportunity>();

      if (!sObjectRecordsForUpdation.IsEmpty()) {
        for (sObject record : sObjectRecordsForUpdation) {
          if (record instanceof Lead) {
            Lead leadToUpdate = (Lead) record;

            if (String.valueOf(leadToUpdate.OwnerId).equals(fromUserId)) {
              leadToUpdate.OwnerId = toUserId;
              leads.add(leadToUpdate);
            }
          } else if (record instanceof Account) {
            Account accountToUpdate = (Account) record;

            if (String.valueOf(accountToUpdate.OwnerId).equals(fromUserId)) {
              accountToUpdate.OwnerId = toUserId;
              accounts.add(accountToUpdate);
            }
          } else if (record instanceof Contact) {
            Contact contactToUpdate = (Contact) record;

            if (String.valueOf(contactToUpdate.OwnerId).equals(fromUserId)) {
              contactToUpdate.OwnerId = toUserId;
              contacts.add(contactToUpdate);
            }
          } else if (record instanceof Case) {
            Case caseToUpdate = (Case) record;

            if (String.valueOf(caseToUpdate.OwnerId).equals(fromUserId)) {
              caseToUpdate.OwnerId = toUserId;
              cases.add(caseToUpdate);
            }
          } else if (record instanceof Opportunity) {
            Opportunity opportunityToUpdate = (Opportunity) record;

            if (
              String.valueOf(opportunityToUpdate.OwnerId).equals(fromUserId)
            ) {
              opportunityToUpdate.OwnerId = toUserId;
              opportunities.add(opportunityToUpdate);
            }
          }
        }

        if (!leads.IsEmpty()) {
          Database.update(leads, false);
        }
        if (!accounts.IsEmpty()) {
          Database.update(accounts, false);
        }
        if (!contacts.IsEmpty()) {
          Database.update(contacts, false);
        }
        if (!cases.IsEmpty()) {
          Database.update(cases, false);
        }
        if (!opportunities.IsEmpty()) {
          Database.update(opportunities, false);
        }
      }

      return 'SUCCESS';
    } catch (Exception exp) {
      throw new AuraHandledException(exp.getMessage());
    }
  }
}
