import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';

part 'priorities.g.dart';

/// Per-country order of trust for choosing the figure to show (Kenya ranks KNBS first).
@JsonSerializable(includeIfNull: false)
class StatisticsPriorities {
  const StatisticsPriorities({
    this.collectionId,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.position,
    this.stewardId,
    required this.updatedAt,
    required this.version,
  });
  final String? collectionId;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final int position;
  final String? stewardId;
  final DateTime updatedAt;
  final int version;

  factory StatisticsPriorities.fromJson(Map<String, dynamic> json) => _$StatisticsPrioritiesFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsPrioritiesToJson(this);
}
