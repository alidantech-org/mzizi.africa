import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'seasons.g.dart';

/// A recurring season of a country or region.
@JsonSerializable(includeIfNull: false)
class EventSeasons {
  const EventSeasons({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endDay,
    required this.endMonth,
    this.featureId,
    required this.id,
    required this.isNatural,
    required this.kindTerm,
    this.startDay,
    required this.startMonth,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? endDay;
  final int endMonth;
  final String? featureId;
  final String id;
  final bool isNatural;
  final String kindTerm;
  final int? startDay;
  final int startMonth;
  final DateTime updatedAt;
  final int version;

  factory EventSeasons.fromJson(Map<String, dynamic> json) => _$EventSeasonsFromJson(json);

  Map<String, dynamic> toJson() => _$EventSeasonsToJson(this);
}
