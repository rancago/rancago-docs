import React, { useMemo, useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Check,
  Copy,
  Folder,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface InteractiveCliPlaygroundProps {
  lang: Language;
}

type CliPreset = {
  id: string;
  label: string;
  cmd: string;
  logs: (ctx: { version: string; buildDate?: string | null; lang: Language }) => string[];
};

export const InteractiveCliPlayground: React.FC<InteractiveCliPlaygroundProps> = ({
  lang,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('make-feature');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCodeFile, setActiveCodeFile] = useState<string>('bootstrap.go');
  const [copiedCode, setCopiedCode] = useState(false);

  const cliVersion = '1.0.0';

  const bannerLines = useMemo(
    () => [
      '  ____                                        ',
      ' |  _ \\\\ __ _ _ __   ___ __ _  __ _  ___      ',
      ' | |_) / _` | \\'_ \\\\ / __/ _` |/ _` |/ _ \\\\     ',
      ' |  _ < (_| | | | | (_| (_| | (_| | (_) |    ',
      ' |_| \\\\_\\\\__,_|_| |_|\\\\___\\\\__,_|\\\\__, |\\\\___/     ',
      '                               |___/          ',
    ],
    [],
  );

  const terminalBanner = useMemo(
    () => [
      ...bannerLines,
      `rancago v${cliVersion} — Framework Toolkit (ᮛᮔ᮪ᮎᮌ᮰)`,
      '',
    ],
    [bannerLines, cliVersion],
  );

  const staticCliPresets: CliPreset[] = useMemo(() => ([
    {
      id: 'make-feature',
      label: 'rancago make:feature Order',
      cmd: 'rancago make:feature Order',
      logs: ({ version }) => [
        ...terminalBanner,
        `⚡ rancago v${version}`,
        '------------------------------------------------',
        '  🏗️  Feature name: Order',
        '  📝 Description: Manage customer orders',
        '  → Create domain entity? [Y/n] Y',
        '  → Create driven repository port? [Y/n] Y',
        '  → Create driving use case port + interactor? [Y/n] Y',
        '  → Create HTTP driving adapter? [Y/n] Y',
        '  → Create gRPC driving adapter? [y/N] N',
        '',
        '  🚀 Scaffolding feature "Order" (hexagonal)',
        '  ============================================================',
        '  ✅ Created internal/domain/entities/Order.go',
        '  ✅ Created internal/ports/driven/OrderRepository.go',
        '  ✅ Created internal/ports/driving/OrderUseCase.go',
        '  ✅ Created internal/application/usecases/order_usecase.go',
        '  ✅ Created internal/adapters/driving/orderhandler/orderhandler_adapter.go',
        '  📄 Created Feature Docs: docs/features/order.md',
        '',
        '  ✅ Feature "Order" scaffolded!',
        '  📌 Wire adapters in internal/bootstrap/app.go to go live.',
      ],
    },
    {
      id: 'scaffold',
      label: 'rancago scaffold Payment',
      cmd: 'rancago scaffold Payment',
      logs: ({ version }) => [
        ...terminalBanner,
        `⚡ rancago v${version}`,
        '------------------------------------------------',
        '  🏗️  Component name: Payment',
        '  → Create domain entity? [Y/n] Y',
        '  → Create driven repository port? [Y/n] Y',
        '  → Create driving use case port + interactor? [Y/n] Y',
        '  → Create HTTP driving adapter? [Y/n] Y',
        '  → Create gRPC driving adapter? [y/N] N',
        '',
        '  🚀 Scaffolding bounded context "Payment" (hexagonal)',
        '  ============================================================',
        '  ✅ Created internal/domain/entities/Payment.go',
        '  ✅ Created internal/ports/driven/PaymentRepository.go',
        '  ✅ Created internal/ports/driving/PaymentUseCase.go',
        '  ✅ Created internal/application/usecases/payment_usecase.go',
        '  ✅ Created internal/adapters/driving/paymenthandler/paymenthandler_adapter.go',
        '',
        '  ✅ Scaffold "Payment" done! Wire adapters in internal/bootstrap and you\'re live.',
        '  📄 AI context: docs/features/payment.md',
      ],
    },
    {
      id: 'tinker',
      label: 'rancago tinker',
      cmd: 'rancago tinker',
      logs: ({ version }) => [
        ...terminalBanner,
        `⚡ rancago v${version}`,
        '------------------------------------------------',
        '  🔮 Rancago Tinker REPL (minimal)',
        '  Commands: help, ports, ls, info, quit',
        '',
        'rancago> ls',
        '',
        '  Container bindings (kernel.Container):',
        '    - config            : *kernel.Config',
        '    - redis             : driven.CachePort',
        '    - ws.hub            : driven.WebSocketPort',
        '    - storage           : driven.StorageManagerPort',
        '    - socialite         : driven.SocialitePort',
        '    - repo.notification : driven.NotificationRepository',
        '    - repo.user         : driven.UserRepository',
        '    - repo.role         : driven.RoleRepository',
        '    - repo.permission   : driven.PermissionRepository',
        '    - repo.document     : driven.DocumentRepository',
        '    - uc.notification   : driving.NotificationUseCase',
        '    - uc.user           : driving.UserUseCase',
        '    - uc.document       : driving.DocumentUseCase',
        '',
        'rancago> ports',
        '',
        '  Driving ports (inbound adapters implement these):',
        '    - NotificationUseCase',
        '    - UserUseCase',
        '    - DocumentUseCase',
        '',
        '  Driven ports (outbound adapters implement these):',
        '    - NotificationRepository / UserRepository / RoleRepository',
        '    - PermissionRepository / DocumentRepository',
        '    - CachePort / StorageDriver / StorageManagerPort',
        '    - WebSocketPort / AuthProviderPort / SocialitePort',
        '',
        'rancago> info',
        '',
        '  Rancago Framework 1.0.0 - Hexagonal Architecture Edition',
        '  Go module: github.com/rancago/framework',
        '  Pattern: Ports & Adapters (Hexagonal)',
        '  Layers:  domain → ports → application → adapters → bootstrap',
        '',
        'rancago> quit',
        '  Goodbye! ᮛᮔ᮪ᮎᮌ᮰',
      ],
    },
  ]), [terminalBanner]);

  const cliPresets = staticCliPresets;

  const codeFiles: Record<string, { filename: string; path: string; code: string }> = useMemo(() => ({
    'bootstrap.go': {
      filename: 'app.go',
      path: 'bootstrap/app.go',
      code: `package bootstrap

import (
	"github.com/rancago/framework/framework/Container"
	"github.com/rancago/framework/framework/Cache"
	"github.com/rancago/framework/framework/WebSocket"
	"github.com/rancago/framework/app/Services"
	"github.com/rancago/framework/internal/application/usecases"
	"github.com/rancago/framework/internal/adapters/driven/persistence/inmemory"
	"github.com/rancago/framework/internal/ports/driven"
	"github.com/rancago/framework/internal/ports/driving"
)

func (a *Application) RegisterCore() {
	// Redis — Singleton CachePort
	a.Container.Singleton("redis", func(c *Container.Container) (interface{}, error) {
		mgr := Cache.NewRedisManager(&Cache.RedisConfig{
			Host: a.Config.Redis.Host,
			Port: a.Config.Redis.Port,
		})
		_ = mgr.Connect()
		return mgr, nil
	})

	// WebSocket Hub — depends on Redis
	a.Container.Singleton("ws.hub", func(c *Container.Container) (interface{}, error) {
		redisRaw, _ := c.Resolve("redis")
		hub := WebSocket.NewHub(redisRaw.(*Cache.RedisManager))
		hub.StartRedisListener()
		go hub.Run()
		return hub, nil
	})

	// NotificationService
	a.Container.Singleton("service.notification", func(c *Container.Container) (interface{}, error) {
		redisRaw, _ := c.Resolve("redis")
		hubRaw, _ := c.Resolve("ws.hub")
		return Services.NewNotificationService(
			redisRaw.(*Cache.RedisManager),
			hubRaw.(*WebSocket.Hub),
		), nil
	})
	a.Container.Alias("service.notification", "Contracts.NotificationService")

	// Notification use case (hexagonal layer)
	a.Container.Singleton("repo.notification", func(c *Container.Container) (interface{}, error) {
		return inmemory.NewInMemoryNotificationRepo(), nil
	})
	a.Container.Singleton("uc.notification", func(c *Container.Container) (interface{}, error) {
		repoRaw, _ := c.Resolve("repo.notification")
		redisRaw, _ := c.Resolve("redis")
		wsRaw, _ := c.Resolve("ws.hub")
		return usecases.NewNotificationInteractor(
			repoRaw.(driven.NotificationRepository),
			redisRaw.(driven.CachePort),
			wsRaw.(driven.WebSocketPort),
		), nil
	})
	a.Container.Alias("uc.notification", "driving.NotificationUseCase")
}`,
    },
    'entity.go': {
      filename: 'Order.go',
      path: 'internal/domain/entities/Order.go',
      code: `package entities

import (
	"time"
	"github.com/rancago/framework/internal/domain/valueobjects"
)

// Order is a pure domain entity — zero external dependencies.
type Order struct {
	ID        valueobjects.ID
	UserID    valueobjects.ID
	Items     []*OrderItem
	Status    OrderStatus
	Total     float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusCancelled OrderStatus = "cancelled"
)

type OrderItem struct {
	ProductID valueobjects.ID
	Quantity  int
	Price     float64
}

func NewOrder(userID valueobjects.ID) *Order {
	now := time.Now()
	return &Order{
		UserID:    userID,
		Status:    OrderStatusPending,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

func (o *Order) Cancel() error {
	if o.Status == OrderStatusShipped {
		// Domain error — imported from domain/errors, never from adapters
		return nil // replace with derrors.New("order.cancel", derrors.ErrConflict, ...)
	}
	o.Status = OrderStatusCancelled
	o.UpdatedAt = time.Now()
	return nil
}`,
    },
    'usecase.go': {
      filename: 'order_usecase.go',
      path: 'internal/application/usecases/order_usecase.go',
      code: `package usecases

import (
	"context"
	"github.com/rancago/framework/internal/domain/entities"
	"github.com/rancago/framework/internal/domain/valueobjects"
	derrors "github.com/rancago/framework/internal/domain/errors"
	"github.com/rancago/framework/internal/ports/driven"
	"github.com/rancago/framework/internal/ports/driving"
)

type OrderInteractor struct {
	// Depends on interface (driven port) — never on concrete adapter struct
	orders driven.OrderRepository
}

// Constructor injection — swap any driven adapter without changing this file
func NewOrderInteractor(orders driven.OrderRepository) driving.OrderUseCase {
	return &OrderInteractor{orders: orders}
}

func (uc *OrderInteractor) CreateOrder(
	ctx context.Context,
	userID valueobjects.ID,
	items []*entities.OrderItem,
) (*entities.Order, error) {
	if len(items) == 0 {
		return nil, derrors.New("order.create", derrors.ErrValidation, "order must have at least one item")
	}
	order := entities.NewOrder(userID)
	order.Items = items
	for _, item := range items {
		order.Total += item.Price * float64(item.Quantity)
	}
	return uc.orders.Create(ctx, order)
}

func (uc *OrderInteractor) CancelOrder(
	ctx context.Context,
	id valueobjects.ID,
	userID valueobjects.ID,
) error {
	order, err := uc.orders.FindByID(ctx, id)
	if err != nil {
		return derrors.New("order.cancel", derrors.ErrNotFound, "order not found")
	}
	if order.UserID != userID {
		return derrors.New("order.cancel", derrors.ErrForbidden, "not your order")
	}
	return order.Cancel()
}`,
    },
  }), []);

  const runPreset = (presetId: string) => {
    const preset = cliPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setIsRunning(true);
    setTerminalOutput(['$ ' + preset.cmd, 'Executing...']);

    setTimeout(() => {
      setTerminalOutput(preset.logs({ version: cliVersion, buildDate: null, lang }));
      setIsRunning(false);
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeFiles[activeCodeFile].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-12 border-b border-[#E2D2C3] dark:border-[#2A2019] bg-[#FAF7F2] dark:bg-[#0C0A09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8C4A27] dark:text-[#E58A3C]">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'id' ? 'Uji Coba Interaktif' : 'Interactive Playground'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2118] dark:text-[#F7F2EC] mt-1">
            {lang === 'id'
              ? 'Simulasi Rancago CLI & Kode Hexagonal Architecture'
              : 'Interactive Rancago CLI & Hexagonal Architecture Code Explorer'}
          </h2>
          <p className="text-sm text-[#6E5748] dark:text-[#A8988B] mt-2">
            {lang === 'id'
              ? 'Jalankan simulasi perintah CLI dan jelajahi kode arsitektur hexagonal yang dihasilkan.'
              : 'Run simulated CLI commands and explore the generated hexagonal architecture code.'}
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {cliPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => runPreset(preset.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedPreset === preset.id
                  ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] font-bold shadow-sm'
                  : 'bg-white dark:bg-[#16110E] border border-[#E2D2C3] dark:border-[#2C2018] text-[#3B2D25] dark:text-[#D4C7BC] hover:border-[#8C4A27] dark:hover:border-[#E58A3C]'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* 2-Column Terminal & Code Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 w-full">
          {/* Left Column: Simulated Terminal Emulator */}
          <div className="rounded-xl border border-[#3D2E24] dark:border-[#2C2018] bg-[#231A14] text-[#F7F2EC] shadow-xl overflow-hidden font-mono flex flex-col h-[420px] min-w-0 w-full">
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1B140F] border-b border-[#3D2E24] text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[#A8988B] font-semibold ml-2 truncate">
                  bash — rancago v{cliVersion} (ᮛᮔ᮪ᮎᮌ᮰)
                </span>
              </div>
              <button
                onClick={() => runPreset(selectedPreset)}
                className="p-1 rounded hover:bg-[#38281F] text-[#A8988B] hover:text-white"
                title="Re-run command"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Terminal Output Stream */}
            <div className="p-4 text-xs space-y-1.5 overflow-y-auto overflow-x-auto flex-1 leading-relaxed bg-[#17110D] text-[#E58A3C] min-w-0">
              {terminalOutput.length === 0 ? (
                <div className="space-y-2">
                  <pre className="text-[#F7F2EC] whitespace-pre overflow-x-auto">{bannerLines.join('\n')}</pre>
                  <div className="text-[#8A766A]">
                    {lang === 'id'
                      ? 'Pilih perintah di atas untuk melihat simulasi output.'
                      : 'Select a command above to see simulated output.'}
                  </div>
                </div>
              ) : (
                terminalOutput.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2 min-w-0">
                    {line.startsWith('  ✅') || line.startsWith('  📄') ? (
                      <span className="text-emerald-400 font-bold break-all whitespace-pre-wrap">{line}</span>
                    ) : line.startsWith('  ✅') || line.startsWith('⚡') ? (
                      <span className="text-[#E58A3C] font-bold break-all whitespace-pre-wrap">{line}</span>
                    ) : line.startsWith('  🚀') || line.startsWith('  🔮') ? (
                      <span className="text-[#E58A3C] font-bold break-all whitespace-pre-wrap">{line}</span>
                    ) : line.startsWith('rancago>') ? (
                      <span className="text-amber-300 font-bold break-all whitespace-pre-wrap">{line}</span>
                    ) : line === '' ? (
                      <span>&nbsp;</span>
                    ) : (
                      <span className="text-[#F7F2EC] break-all whitespace-pre-wrap">{line}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Code File Viewer */}
          <div className="rounded-xl border border-[#E2D2C3] dark:border-[#2C2018] bg-white dark:bg-[#16110E] shadow-xl overflow-hidden flex flex-col h-[420px] min-w-0 w-full">
            {/* File Tabs Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#F5EBE1] dark:bg-[#1B140F] border-b border-[#E2D2C3] dark:border-[#2C2018] text-xs">
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.keys(codeFiles).map((fileKey) => (
                  <button
                    key={fileKey}
                    onClick={() => setActiveCodeFile(fileKey)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ${
                      activeCodeFile === fileKey
                        ? 'bg-white dark:bg-[#251D18] text-[#8C4A27] dark:text-[#E58A3C] font-bold shadow-2xs'
                        : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#8C4A27] dark:text-[#E58A3C]" />
                    <span>{codeFiles[fileKey].filename}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded hover:bg-[#EADBCE] dark:hover:bg-[#251D18] text-[#6E5748] dark:text-[#A8988B] shrink-0"
                title="Copy code"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Path Banner */}
            <div className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 truncate">
              <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{codeFiles[activeCodeFile].path}</span>
            </div>

            {/* Code Body */}
            <div className="p-4 text-xs font-mono overflow-y-auto overflow-x-auto flex-1 bg-zinc-950 text-zinc-200 leading-relaxed min-w-0">
              <pre className="overflow-x-auto max-w-full">{codeFiles[activeCodeFile].code}</pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
