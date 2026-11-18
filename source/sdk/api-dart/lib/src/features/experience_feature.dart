import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/experience_endpoints.dart';
import 'package:mzizi_api/src/models/experience/calendar.dart';
import 'package:mzizi_api/src/models/experience/calendar_input.dart';
import 'package:mzizi_api/src/models/experience/context.dart';
import 'package:mzizi_api/src/models/experience/context_input.dart';
import 'package:mzizi_api/src/models/experience/copy_catalog.dart';
import 'package:mzizi_api/src/models/experience/copy_input.dart';
import 'package:mzizi_api/src/models/experience/facilities_input.dart';
import 'package:mzizi_api/src/models/experience/facility_detail.dart';
import 'package:mzizi_api/src/models/experience/facility_key.dart';
import 'package:mzizi_api/src/models/experience/facility_list.dart';
import 'package:mzizi_api/src/models/experience/fact_list.dart';
import 'package:mzizi_api/src/models/experience/facts_input.dart';

/// Typed client for the Experience group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ExperienceFeature {
  const ExperienceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ExperienceEndpoints();

  /// Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.
  ///
  /// GET /v1/calendar
  Future<ApiResult<ExperienceCalendar>> getCalendar({ExperienceCalendarInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExperienceCalendar>(
        endpoint: _routes.getCalendar,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.getCalendar'),
        query: input?.toJson(),
        fromJson: (json) => ExperienceCalendar.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.
  ///
  /// GET /v1/context
  Future<ApiResult<ExperienceContext>> getContext({
    String? countryCode,
    String? languageCode,
    String? path,
    String? featureId,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<ExperienceContext>(
        endpoint: _routes.getContext,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.getContext'),
        query: <String, Object?>{
          if (countryCode != null) 'countryCode': countryCode,
          if (languageCode != null) 'languageCode': languageCode,
          if (path != null) 'path': path,
          if (featureId != null) 'featureId': featureId,
        },
        fromJson: (json) => ExperienceContext.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The interface wording for one language, with the country's own wording where it differs. Screens declare copy keys; the words are delivered from here.
  ///
  /// GET /v1/copy
  Future<ApiResult<ExperienceCopyCatalog>> getCopy({ExperienceCopyInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExperienceCopyCatalog>(
        endpoint: _routes.getCopy,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.getCopy'),
        query: input?.toJson(),
        fromJson: (json) => ExperienceCopyCatalog.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One facility with its capacity, the places it is in and the polling stations it hosts.
  ///
  /// GET /v1/facilities/{code}
  Future<ApiResult<ExperienceFacilityDetail>> getFacility({required String code, String? languageCode, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExperienceFacilityDetail>(
        endpoint: _routes.getFacility(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.getFacility'),
        query: <String, Object?>{if (languageCode != null) 'languageCode': languageCode},
        fromJson: (json) => ExperienceFacilityDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.
  ///
  /// GET /v1/facilities
  Future<ApiResult<ExperienceFacilityList>> listFacilities({ExperienceFacilitiesInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExperienceFacilityList>(
        endpoint: _routes.listFacilities,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.listFacilities'),
        query: input?.toJson(),
        fromJson: (json) => ExperienceFacilityList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Fun facts for the country and, with a place, for it and the places above it.
  ///
  /// GET /v1/facts
  Future<ApiResult<ExperienceFactList>> listFacts({ExperienceFactsInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ExperienceFactList>(
        endpoint: _routes.listFacts,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'experience.listFacts'),
        query: input?.toJson(),
        fromJson: (json) => ExperienceFactList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
