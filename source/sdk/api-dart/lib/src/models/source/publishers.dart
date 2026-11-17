import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'publishers.g.dart';

/// Accepted publisher; an optional official identity distinguishes organization from publication channel.
@JsonSerializable(includeIfNull: false)
class SourcePublishers {
  const SourcePublishers({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kindId,
    required this.name,
    this.officialEntityId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String kindId;
  final String name;
  final String? officialEntityId;
  final DateTime updatedAt;
  final int version;

  factory SourcePublishers.fromJson(Map<String, dynamic> json) => _$SourcePublishersFromJson(json);

  Map<String, dynamic> toJson() => _$SourcePublishersToJson(this);
}
