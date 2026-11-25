import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/source/paths.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'discoveries.g.dart';

/// A link found while crawling.
@JsonSerializable(includeIfNull: false)
class SourceDiscoveries {
  const SourceDiscoveries({
    this.anchorText,
    this.context,
    required this.createdAt,
    required this.discoveredAt,
    this.foundOnId,
    required this.id,
    required this.observedUrl,
    this.pathId,
    this.sourceId,
  });
  final String? anchorText;
  final String? context;
  final DateTime createdAt;
  final DateTime discoveredAt;
  final String? foundOnId;
  final String id;
  final String observedUrl;
  final String? pathId;
  final String? sourceId;

  factory SourceDiscoveries.fromJson(Map<String, dynamic> json) => _$SourceDiscoveriesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDiscoveriesToJson(this);
}
