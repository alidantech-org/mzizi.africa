import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'seasons.g.dart';

/// A recurring yearly window, natural or human: the long rains, a planting season, a school term, for a country or a place. Gives the calendar its seasonal context and explains recurring patterns in data.
@JsonSerializable(includeIfNull: false)
class EventSeasons {
  const EventSeasons({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.description,
    this.endDay,
    required this.endMonth,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.isNatural,
    this.scopeFeatureId,
    required this.seasonKindId,
    this.sourceCitationId,
    this.startDay,
    required this.startMonth,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final int? endDay;
  final int endMonth;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final bool isNatural;
  final String? scopeFeatureId;
  final String seasonKindId;
  final String? sourceCitationId;
  final int? startDay;
  final int startMonth;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory EventSeasons.fromJson(Map<String, dynamic> json) => _$EventSeasonsFromJson(json);

  Map<String, dynamic> toJson() => _$EventSeasonsToJson(this);
}
