import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/governance_endpoints.dart';
import 'package:mzizi_api/src/models/governance/institution_collection.dart';
import 'package:mzizi_api/src/models/governance/institution_detail.dart';
import 'package:mzizi_api/src/models/governance/institution_key.dart';
import 'package:mzizi_api/src/models/governance/institution_window.dart';
import 'package:mzizi_api/src/models/governance/office_detail.dart';
import 'package:mzizi_api/src/models/governance/office_key.dart';

/// Typed client for the Governance group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class GovernanceFeature {
  const GovernanceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = GovernanceEndpoints();

  /// Page through public institutions with their names, optionally by code prefix.
  ///
  /// GET /v1/governance/institutions
  Future<ApiResult<GovernanceInstitutionCollection>> browseInstitutions({GovernanceInstitutionWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceInstitutionCollection>(
        endpoint: _routes.browseInstitutions,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.browseInstitutions'),
        query: input?.toJson(),
        fromJson: (json) => GovernanceInstitutionCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One institution with its mandates and offices.
  ///
  /// GET /v1/governance/institutions/{institutionId}
  Future<ApiResult<GovernanceInstitutionDetail>> getInstitution({required String institutionId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceInstitutionDetail>(
        endpoint: _routes.getInstitution(institutionId: institutionId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.getInstitution'),
        fromJson: (json) => GovernanceInstitutionDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One office with everyone who has held it, newest first.
  ///
  /// GET /v1/governance/offices/{officeId}
  Future<ApiResult<GovernanceOfficeDetail>> getOffice({required String officeId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GovernanceOfficeDetail>(
        endpoint: _routes.getOffice(officeId: officeId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'governance.getOffice'),
        fromJson: (json) => GovernanceOfficeDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
