import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/addresses.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'discoveries.g.dart';

/// An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture.
@JsonSerializable(includeIfNull: false)
class SourceDiscoveries {
  const SourceDiscoveries({
    this.addressId,
    this.anchorText,
    this.context,
    required this.createdAt,
    this.deletedAt,
    required this.discoveredAt,
    this.foundOnAddressId,
    required this.id,
    required this.observedUrl,
    this.sourceId,
    required this.updatedAt,
    required this.version,
  });
  final String? addressId;
  final String? anchorText;
  final String? context;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime discoveredAt;
  final String? foundOnAddressId;
  final String id;
  final String observedUrl;
  final String? sourceId;
  final DateTime updatedAt;
  final int version;

  factory SourceDiscoveries.fromJson(Map<String, dynamic> json) => _$SourceDiscoveriesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDiscoveriesToJson(this);
}
