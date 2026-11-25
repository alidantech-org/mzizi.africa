import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/templates.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/official/contacts.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/sources.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'domains.g.dart';

/// A host name a source publishes on.
@JsonSerializable(includeIfNull: false)
class SourceDomains {
  const SourceDomains({
    required this.code,
    this.contactId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.host,
    required this.id,
    this.lastCheckedAt,
    this.ownerId,
    this.sourceId,
    this.startsOn,
    required this.statusTerm,
    this.templateId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? contactId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String host;
  final String id;
  final DateTime? lastCheckedAt;
  final String? ownerId;
  final String? sourceId;
  final DateTime? startsOn;
  final String statusTerm;
  final String? templateId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SourceDomains.fromJson(Map<String, dynamic> json) => _$SourceDomainsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDomainsToJson(this);
}
