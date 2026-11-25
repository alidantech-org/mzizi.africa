import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/governance_endpoints.dart';
import 'package:mzizi_api/src/models/governance/governance_identity_scope.dart';
import 'package:mzizi_api/src/models/governance/institution_collection.dart';
import 'package:mzizi_api/src/models/governance/institution_detail.dart';
import 'package:mzizi_api/src/models/governance/institution_key.dart';
import 'package:mzizi_api/src/models/governance/institution_window.dart';
import 'package:mzizi_api/src/models/governance/office_collection.dart';
import 'package:mzizi_api/src/models/governance/office_detail.dart';
import 'package:mzizi_api/src/models/governance/office_key.dart';
import 'package:mzizi_api/src/models/governance/place_offices.dart';
import 'package:mzizi_api/src/models/governance/power_collection.dart';
import 'package:mzizi_api/src/models/governance/relationship_collection.dart';

/// Typed client for the Governance group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class GovernanceFeature {
  const GovernanceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = GovernanceEndpoints();

  /// One institution with its offices and their holders: the leadership tree.
  ///
  /// GET /v1/governance/institutions/{code}
  Future<ApiResult<GovernanceInstitutionDetail>> getInstitution({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceInstitutionDetail>(
        endpoint: _routes.getInstitution(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.getInstitution'),
        fromJson: (json) => GovernanceInstitutionDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One office with every holder and the steps that put each in office.
  ///
  /// GET /v1/governance/offices/{code}
  Future<ApiResult<GovernanceOfficeDetail>> getOffice({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceOfficeDetail>(
        endpoint: _routes.getOffice(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.getOffice'),
        fromJson: (json) => GovernanceOfficeDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's public institutions, optionally of one arm.
  ///
  /// GET /v1/governance/institutions
  Future<ApiResult<GovernanceInstitutionCollection>> listInstitutions({GovernanceInstitutionWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceInstitutionCollection>(
        endpoint: _routes.listInstitutions,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.listInstitutions'),
        query: input?.toJson(),
        fromJson: (json) => GovernanceInstitutionCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// What sits under or reports to an institution, position or office (part of, oversees, accountable to).
  ///
  /// GET /v1/governance/members
  Future<ApiResult<GovernanceRelationshipCollection>> listMembers({GovernanceGovernanceIdentityScope? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceRelationshipCollection>(
        endpoint: _routes.listMembers,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.listMembers'),
        query: input?.toJson(),
        fromJson: (json) => GovernanceRelationshipCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The current offices for a place (governor, MCAs) with who holds them.
  ///
  /// GET /v1/governance/offices
  Future<ApiResult<GovernanceOfficeCollection>> listPlaceOffices({GovernancePlaceOffices? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceOfficeCollection>(
        endpoint: _routes.listPlaceOffices,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.listPlaceOffices'),
        query: input?.toJson(),
        fromJson: (json) => GovernanceOfficeCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The powers a position or institution holds over others (appoint, dismiss, veto, approve).
  ///
  /// GET /v1/governance/powers
  Future<ApiResult<GovernancePowerCollection>> listPowers({GovernanceGovernanceIdentityScope? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernancePowerCollection>(
        endpoint: _routes.listPowers,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.listPowers'),
        query: input?.toJson(),
        fromJson: (json) => GovernancePowerCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
