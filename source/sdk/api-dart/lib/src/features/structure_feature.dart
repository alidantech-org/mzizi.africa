import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/structure_endpoints.dart';
import 'package:mzizi_api/src/models/structure/country_context_document.dart';
import 'package:mzizi_api/src/models/structure/structure_document.dart';
import 'package:mzizi_api/src/models/structure/structure_input.dart';

/// Typed client for the Structure group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class StructureFeature {
  const StructureFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = StructureEndpoints();

  /// Explicit country identity and recorded routing roots; no default-country inference.
  ///
  /// GET /v1/structure/context
  Future<ApiResult<StructureCountryContextDocument>> getCountryContext({StructureStructureInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StructureCountryContextDocument>(
        endpoint: _routes.getCountryContext,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'structure.getCountryContext'),
        query: input?.toJson(),
        fromJson: (json) => StructureCountryContextDocument.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Country governance structure with typed positions, offices, powers, procedures and responsibilities. Scope is explicitly national; missing records do not establish absence.
  ///
  /// GET /v1/structure
  Future<ApiResult<StructureStructureDocument>> getStructureScreen({StructureStructureInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StructureStructureDocument>(
        endpoint: _routes.getStructureScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'structure.getStructureScreen'),
        query: input?.toJson(),
        fromJson: (json) => StructureStructureDocument.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
