import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/event_endpoints.dart';
import 'package:mzizi_api/src/models/event/calendar_window.dart';
import 'package:mzizi_api/src/models/event/occurrence_collection.dart';

/// Typed client for the Event group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class EventFeature {
  const EventFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = EventEndpoints();

  /// A country's civic calendar from a date: holidays, sittings, deadlines and polling days.
  ///
  /// GET /v1/event/occurrences
  Future<ApiResult<EventOccurrenceCollection>> listOccurrences({EventCalendarWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<EventOccurrenceCollection>(
        endpoint: _routes.listOccurrences,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'event.listOccurrences'),
        query: input?.toJson(),
        fromJson: (json) => EventOccurrenceCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
