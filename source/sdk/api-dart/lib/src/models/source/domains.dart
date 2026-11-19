import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/official/contacts.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/template.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'domains.g.dart';

/// A host name a source is served from. A host belongs to one source at a time; its validity period records moves.
@JsonSerializable(includeIfNull: false)
class SourceDomains {
  const SourceDomains({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.entityId,
    this.fromToPrecision,
    this.fromYear,
    required this.host,
    required this.id,
    this.lastCheckedAt,
    this.officialContactId,
    this.sourceId,
    this.startsOn,
    this.statusId,
    this.templateId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String? entityId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String host;
  final String id;
  final DateTime? lastCheckedAt;
  final String? officialContactId;
  final String? sourceId;
  final DateTime? startsOn;
  final String? statusId;
  final String? templateId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SourceDomains.fromJson(Map<String, dynamic> json) => _$SourceDomainsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDomainsToJson(this);
}
