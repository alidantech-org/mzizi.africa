import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'domains.g.dart';

/// A host name a source is served from. A source can have several over time, and a domain keeps its own validity period.
@JsonSerializable(includeIfNull: false)
class SourceDomains {
  const SourceDomains({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.host,
    required this.id,
    required this.sourceId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String host;
  final String id;
  final String sourceId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory SourceDomains.fromJson(Map<String, dynamic> json) => _$SourceDomainsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDomainsToJson(this);
}
