import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/legal_endpoints.dart';
import 'package:mzizi_api/src/models/legal/effect_collection.dart';
import 'package:mzizi_api/src/models/legal/identity_effects.dart';
import 'package:mzizi_api/src/models/legal/instrument_collection.dart';
import 'package:mzizi_api/src/models/legal/instrument_detail.dart';
import 'package:mzizi_api/src/models/legal/instrument_key.dart';
import 'package:mzizi_api/src/models/legal/instrument_window.dart';
import 'package:mzizi_api/src/models/legal/provision_collection.dart';
import 'package:mzizi_api/src/models/legal/provision_scope.dart';

/// Typed client for the Legal group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class LegalFeature {
  const LegalFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = LegalEndpoints();

  /// One instrument with its editions.
  ///
  /// GET /v1/legal/instruments/{code}
  Future<ApiResult<LegalInstrumentDetail>> getInstrument({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegalInstrumentDetail>(
        endpoint: _routes.getInstrument(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legal.getInstrument'),
        fromJson: (json) => LegalInstrumentDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// What law does to a named thing: the provisions that establish, govern or limit it.
  ///
  /// GET /v1/legal/effects
  Future<ApiResult<LegalEffectCollection>> listEffects({LegalIdentityEffects? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegalEffectCollection>(
        endpoint: _routes.listEffects,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legal.listEffects'),
        query: input?.toJson(),
        fromJson: (json) => LegalEffectCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Legal instruments, newest first, optionally of one kind.
  ///
  /// GET /v1/legal/instruments
  Future<ApiResult<LegalInstrumentCollection>> listInstruments({LegalInstrumentWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegalInstrumentCollection>(
        endpoint: _routes.listInstruments,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legal.listInstruments'),
        query: input?.toJson(),
        fromJson: (json) => LegalInstrumentCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The provision tree of an instrument with every official wording.
  ///
  /// GET /v1/legal/provisions
  Future<ApiResult<LegalProvisionCollection>> listProvisions({LegalProvisionScope? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LegalProvisionCollection>(
        endpoint: _routes.listProvisions,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'legal.listProvisions'),
        query: input?.toJson(),
        fromJson: (json) => LegalProvisionCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
