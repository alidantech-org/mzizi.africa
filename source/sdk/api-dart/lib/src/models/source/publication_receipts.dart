import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'publication_receipts.g.dart';

/// Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict.
@JsonSerializable(includeIfNull: false)
class SourcePublicationReceipts {
  const SourcePublicationReceipts({
    required this.actorSnapshot,
    required this.code,
    required this.contractVersion,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.idempotencyKey,
    required this.payloadHash,
    required this.publicationRefId,
    required this.publishedAt,
    required this.requestHash,
    required this.resultManifest,
    required this.updatedAt,
    required this.version,
  });
  final String actorSnapshot;
  final String code;
  final String contractVersion;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String idempotencyKey;
  final String payloadHash;
  final String publicationRefId;
  final DateTime publishedAt;
  final String requestHash;
  final String resultManifest;
  final DateTime updatedAt;
  final int version;

  factory SourcePublicationReceipts.fromJson(Map<String, dynamic> json) => _$SourcePublicationReceiptsFromJson(json);

  Map<String, dynamic> toJson() => _$SourcePublicationReceiptsToJson(this);
}
