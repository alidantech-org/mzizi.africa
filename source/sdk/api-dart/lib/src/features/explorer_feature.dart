import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/explorer_endpoints.dart';
import 'package:mzizi_api/src/models/explorer/addresses.dart';
import 'package:mzizi_api/src/models/explorer/addresses_input.dart';
import 'package:mzizi_api/src/models/explorer/bootstrap.dart';
import 'package:mzizi_api/src/models/explorer/bootstrap_input.dart';
import 'package:mzizi_api/src/models/explorer/children_input.dart';
import 'package:mzizi_api/src/models/explorer/context.dart';
import 'package:mzizi_api/src/models/explorer/coordinates_input.dart';
import 'package:mzizi_api/src/models/explorer/copy_bundle.dart';
import 'package:mzizi_api/src/models/explorer/copy_input.dart';
import 'package:mzizi_api/src/models/explorer/location.dart';
import 'package:mzizi_api/src/models/explorer/location_input.dart';
import 'package:mzizi_api/src/models/explorer/navigation.dart';
import 'package:mzizi_api/src/models/explorer/navigation_input.dart';
import 'package:mzizi_api/src/models/explorer/overview.dart';
import 'package:mzizi_api/src/models/explorer/place_input.dart';
import 'package:mzizi_api/src/models/explorer/places.dart';
import 'package:mzizi_api/src/models/explorer/resolution.dart';
import 'package:mzizi_api/src/models/explorer/search_input.dart';

/// Typed client for the Explorer group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ExplorerFeature {
  const ExplorerFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ExplorerEndpoints();

  /// Every recorded wording for one language, optionally one area and country wording, with a content hash for long-lived caching. Words are never taken from another language.
  ///
  /// GET /v1/explorer/copy
  Future<ApiResult<ExplorerCopyBundle>> getCopyBundle({ExplorerCopyInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerCopyBundle>(
        endpoint: _routes.getCopyBundle,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getCopyBundle'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerCopyBundle.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Resolve an explicit country and registered place path or identity; incompatible identities are rejected.
  ///
  /// GET /v1/explorer/context
  Future<ApiResult<ExplorerContext>> getExplorerContext({ExplorerPlaceInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerContext>(
        endpoint: _routes.getExplorerContext,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getExplorerContext'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerContext.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Everything the location UI shows for one place, resolved on the server from the readable address: the place, its chain, every level kind, the places inside the country root, each ancestor and the place, and one page of a search or level list. Clients send slugs, never identities.
  ///
  /// GET /v1/explorer/location
  Future<ApiResult<ExplorerLocation>> getExplorerLocation({ExplorerLocationInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerLocation>(
        endpoint: _routes.getExplorerLocation,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getExplorerLocation'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerLocation.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Which navigation subjects have recorded data for one explicit country. Availability follows the data, not a list kept by the client.
  ///
  /// GET /v1/explorer/navigation
  Future<ApiResult<ExplorerNavigation>> getExplorerNavigation({ExplorerNavigationInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerNavigation>(
        endpoint: _routes.getExplorerNavigation,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getExplorerNavigation'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerNavigation.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One place's context, direct children and recorded coverage counts; never substitutes demonstration measures.
  ///
  /// GET /v1/explorer/overview
  Future<ApiResult<ExplorerOverview>> getExplorerOverview({ExplorerPlaceInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerOverview>(
        endpoint: _routes.getExplorerOverview,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getExplorerOverview'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerOverview.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Country catalogue and the interface languages that have recorded wording. Never chooses a default country.
  ///
  /// GET /v1/explorer/setup
  Future<ApiResult<ExplorerBootstrap>> getSetupBootstrap({ExplorerBootstrapInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerBootstrap>(
        endpoint: _routes.getSetupBootstrap,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.getSetupBootstrap'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerBootstrap.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Direct children in the recorded routing hierarchy of one explicit country.
  ///
  /// GET /v1/explorer/children
  Future<ApiResult<ExplorerPlaces>> listExplorerChildren({ExplorerChildrenInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerPlaces>(
        endpoint: _routes.listExplorerChildren,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.listExplorerChildren'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerPlaces.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Names and places above them for a list of addresses (saved places), in one language. A body keeps the list out of the address.
  ///
  /// POST /v1/explorer/addresses
  Future<ApiResult<ExplorerAddresses>> resolveExplorerAddresses({required ExplorerAddressesInput input, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<ExplorerAddresses>(
        endpoint: _routes.resolveExplorerAddresses,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'explorer.resolveExplorerAddresses'),
        body: input.toJson(),
        fromJson: (json) => ExplorerAddresses.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Read geographic candidates from recorded boundaries. POST keeps device coordinates out of shared query strings; it performs no writes.
  ///
  /// POST /v1/explorer/resolve
  Future<ApiResult<ExplorerResolution>> resolveExplorerCoordinates({required ExplorerCoordinatesInput input, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<ExplorerResolution>(
        endpoint: _routes.resolveExplorerCoordinates,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'explorer.resolveExplorerCoordinates'),
        body: input.toJson(),
        fromJson: (json) => ExplorerResolution.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Country-scoped registered places with stable pagination and canonical destinations.
  ///
  /// GET /v1/explorer/search
  Future<ApiResult<ExplorerPlaces>> searchExplorerPlaces({ExplorerSearchInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExplorerPlaces>(
        endpoint: _routes.searchExplorerPlaces,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'explorer.searchExplorerPlaces'),
        query: input?.toJson(),
        fromJson: (json) => ExplorerPlaces.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
